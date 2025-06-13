import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loggedIn = new EventEmitter<string>();

  username = '';
  password = '';
  message = '';
  error = false;

  constructor(private api: ApiService) {}

  onLogin(e: Event) {
    e.preventDefault();
    this.api.login(this.username, this.password).subscribe({
      next: () => {
        this.message = `Willkommen, ${this.username}!`;
        this.error = false;
        this.loggedIn.emit(this.username);
        setTimeout(() => this.close.emit(), 1000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Login fehlgeschlagen';
        this.error = true;
      }
    });
  }
}
