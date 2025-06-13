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
    // WebSocket-Updates empfangen
    this.ws.getRatingUpdates().subscribe(update => {
      if (update.movieId === this.movie.id) {
        this.averageRating = +update.average;
        this.ratingCount = +update.count;
      }
    });
  }

  rateMovie(stars: number) {
    const userId = 1; // Optional: Aus Session holen, z.B. über AuthService
    this.api.rateMovie(this.movie.id, stars, userId).subscribe({
      next: () => {
        console.log(`⭐ Bewertung für ${this.movie.title}: ${stars} Sterne`);
        // WebSocket-Update kommt automatisch zurück
      },
      error: err => {
        console.error('Fehler beim Bewerten:', err);
      }
    });
  }
}
