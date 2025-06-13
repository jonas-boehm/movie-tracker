import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPopular().subscribe((data) => {
      this.movies = data;
    });
  }
}
