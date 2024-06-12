import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:3360/register', {
      username: this.username,
      password: this.password
    }).subscribe(response => {
      alert('User registered successfully');
      this.router.navigate(['/login']);
    }, error => {
      alert('Registration failed');
    });
  }
}
