import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];

  searchTerm: string = '';
  selectedGenre: string = 'all';
  selectedYear: string = 'all';
  selectedRating: string = 'all';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPopular().subscribe((data) => {
      this.movies = data;
    });
  }

  get filteredMovies() {
    return this.movies.filter((movie) => {
      const matchesSearch = this.searchTerm
        ? movie.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesGenre = this.selectedGenre !== 'all'
        ? movie.genre_ids?.includes(+this.selectedGenre) || movie.genre === this.selectedGenre
        : true;

      const matchesYear = this.selectedYear !== 'all'
        ? movie.release_date?.startsWith(this.selectedYear)
        : true;

      const matchesRating = this.selectedRating !== 'all'
        ? this.selectedRating === 'none'
          ? !movie.rating
          : movie.rating >= +this.selectedRating
        : true;

      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });
  }
}
