import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './core/services/api.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MovieCardComponent } from './shared/components/movie-card/movie-card.component';
import { RouterOutlet } from '@angular/router';

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
  selectedGenre = 'all';
  selectedYear = 'all';
  selectedRating = 'all';

  movies: any[] = [];
  filteredMovies: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPopular().subscribe((data) => {
      this.movies = data;
      this.filterMovies(); // direkt anwenden
    });
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.showRegister = false;
  }

  logout() {
    this.currentUser = '';
  }

  onFilterChange() {
    this.filterMovies();
  }

  onSearch() {
    this.filterMovies();
  }

  filterMovies() {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesTitle = movie.title?.toLowerCase().includes(this.searchTerm.toLowerCase().trim());

      const matchesGenre = this.selectedGenre === 'all'
        || movie.genre_ids?.includes(Number(this.selectedGenre));

      const matchesYear = this.selectedYear === 'all'
        || movie.release_date?.startsWith(this.selectedYear);

      const matchesRating =
        this.selectedRating === 'none' ? !movie.vote_average :
          this.selectedRating === 'all' ? true :
            movie.vote_average >= Number(this.selectedRating);

      return matchesTitle && matchesGenre && matchesYear && matchesRating;
    });
  }
}
