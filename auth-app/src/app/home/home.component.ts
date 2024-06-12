import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<{ message: string }>('http://localhost:3360/home', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(response => {
        this.message = response.message;
      }, error => {
        this.message = 'Unauthorized';
      });
    } else {
      this.message = 'Unauthorized';
    }
  }
}

