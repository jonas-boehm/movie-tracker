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

  filteredMovies: any[] = [];

  searchTerm = '';
  selectedGenre = 'Alle Genres';
  selectedYear = 'Alle Jahre';
  selectedRating = 'all';

  currentPage = 1;
  totalPages = 1000;
  isLoading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPage(1);
  }

  onSearch() {
    this.loadPage(1);
  }

  onFilterChange() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.currentPage = page;

    const genre = this.selectedGenre !== 'Alle Genres' ? this.selectedGenre : '';
    const year = this.selectedYear !== 'Alle Jahre' ? this.selectedYear : '';
    const rating = this.selectedRating;
    const query = this.searchTerm.trim();

    // Wenn ein Suchbegriff vorhanden ist, zuerst Suche ausführen
    if (query) {
      this.api.searchMovies(query, page).subscribe(data => {
        this.filteredMovies = this.applyLocalFilters(data);
      });
    } else {
      // Kein Suchbegriff → filter API verwenden
      this.api.filterMovies('', genre, year, rating, page).subscribe(data => {
        this.filteredMovies = data;
      });
    }
  }

  applyLocalFilters(movies: any[]) {
    return movies.filter((movie) => {
      const matchesGenre = this.selectedGenre === 'Alle Genres' ||
        (movie.genre_ids && movie.genre_ids.includes(this.mapGenre(this.selectedGenre)));

      const matchesYear = this.selectedYear === 'Alle Jahre' ||
        (movie.release_date && movie.release_date.startsWith(this.selectedYear));

      const matchesRating =
        this.selectedRating === 'all' ? true :
          this.selectedRating === 'none' ? !movie.vote_average :
            movie.vote_average >= +this.selectedRating;

      return matchesGenre && matchesYear && matchesRating;
    });
  }

  mapGenre(name: string): number {
    const genreMap: { [key: string]: number } = {
      'Action': 28,
      'Adventure': 12,
      'Animation': 16,
      'Comedy': 35,
      'Crime': 80,
      'Documentary': 99,
      'Drama': 18,
      'Family': 10751,
      'Fantasy': 14,
      'History': 36,
      'Horror': 27,
      'Music': 10402,
      'Mystery': 9648,
      'Romance': 10749,
      'Science Fiction': 878,
      'TV Movie': 10770,
      'Thriller': 53,
      'War': 10752,
      'Western': 37
    };
    return genreMap[name] || 0;
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
    this.showRegister = false;
  }

  logout() {
    this.currentUser = '';
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  getVisiblePages(): number[] {
    const maxVisible = 9;
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}

