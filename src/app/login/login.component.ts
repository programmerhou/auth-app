import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:3360/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      (response: any) => {
        console.log('Response from server:', response); // Log the response
        alert('Login successful');
        localStorage.setItem('token', response.token);
        const token = response.token;
        this.router.navigate(['./home'], { queryParams: { token } });
        //window.open('http://localhost:4200/home?token=${token}', '_blank'); 
      },
      (error: any) => {
        console.error('Login error', error); // Log error
        if (error.error && error.error.message) {
          alert(`Login failed: ${error.error.message}`);
        } else {
          alert('Login failed: Unknown error');
        }
      }
    );
  }
}


