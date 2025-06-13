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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPopular().subscribe((data) => {
      this.movies = data;
    });
  }

  get filteredMovies() {
    return this.movies.filter(movie =>
      movie.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
