import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './core/services/api.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MovieCardComponent } from './shared/components/movie-card/movie-card.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoginComponent,
    RegisterComponent,
    MovieCardComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser = '';
  showLogin = false;
  showRegister = false;
  searchTerm = '';

  movies: any[] = [];
  filteredMovies: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPopular().subscribe((data) => {
      this.movies = data;
      this.filteredMovies = data;
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredMovies = this.movies.filter((m) =>
      m.title.toLowerCase().includes(term)
    );
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.showRegister = false;
  }

  logout() {
    this.currentUser = '';
  }
}
