import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { RatingService } from '../../../core/services/rating.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnInit {
  @Input() movie: any;

  averageRating = 0;
  ratingCount = 0;

  constructor(private ws: RatingService, private api: ApiService) {}

  ngOnInit() {
    // 🔄 1. Bewertung beim Seitenstart laden
    this.ws.getRating(this.movie.id).subscribe({
      next: (data) => {
        this.averageRating = +data.average;
        this.ratingCount = +data.count;
      },
      error: (err) => {
        console.warn('Keine Bewertung vorhanden oder Fehler beim Laden', err);
      }
    });

    // 🔁 2. WebSocket-Updates empfangen
    this.ws.getRatingUpdates().subscribe(update => {
      if (update.movieId === this.movie.id) {
        this.averageRating = +update.average;
        this.ratingCount = +update.count;
      }
    });
  }

  rateMovie(stars: number) {
    const userId = 1; // 🧠 Optional: später aus Auth holen
    this.ws.sendRating(userId, this.movie.id, stars).subscribe({
      next: () => {
        console.log(`⭐ Bewertung für ${this.movie.title}: ${stars} Sterne`);
        // ⏳ Update wird via WebSocket empfangen
      },
      error: err => {
        console.error('Fehler beim Bewerten:', err);
      }
    });
  }
}
