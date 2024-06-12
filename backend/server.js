const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3360;
const secretKey = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'auth_db'
};

app.get('/', (req, res) => {
  res.send('Welcome to the backend server');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Received registration request for username: ${username}`);
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      console.log('Username already exists');
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    console.log('User registered successfully');
    res.json({ message: 'User registered successfully' });
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        console.log('Generated Token:', token);
        res.json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }

    await connection.end();
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/home', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the Home Page', user: req.user });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
