import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private socket: WebSocket;
  private ratingUpdates$ = new Subject<any>();

  constructor(private http: HttpClient) {
    this.socket = new WebSocket('ws://localhost:3000');
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'ratingUpdate') {
        this.ratingUpdates$.next(msg);
      }
    };
  }

  // 🔄 WebSocket-Stream abonnieren
  getRatingUpdates(): Observable<any> {
    return this.ratingUpdates$.asObservable();
  }

  // 🟡 Bewertung absenden
  sendRating(userId: number, movieId: number, rating: number): Observable<any> {
    return this.http.post('/api/ratings/rate', { userId, movieId, rating });
  }

  // 🟢 Bewertung beim Seitenladen abholen
  getRating(movieId: number): Observable<{ average: number, count: number }> {
    return this.http.get<{ average: number, count: number }>(`/api/ratings/${movieId}`);
  }
}
