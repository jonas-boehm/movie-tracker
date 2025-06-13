import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  username = '';
  password = '';
  message = '';
  error = false;

  constructor(private api: ApiService) {}

  onRegister(e: Event) {
    e.preventDefault();
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Registrierung erfolgreich!';
        this.error = false;
        setTimeout(() => this.switchToLogin.emit(), 1000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Registrierung fehlgeschlagen';
        this.error = true;
      }
    });
  }
}
