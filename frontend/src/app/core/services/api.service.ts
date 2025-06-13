import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/movies';

  constructor(private http: HttpClient) {}

  getPopular(): Observable<any> {
    return this.http.get(`${this.baseUrl}/popular`);
  }

  register(username: string, password: string) {
    return this.http.post('/api/auth/register', { username, password });
  }

  login(username: string, password: string) {
    return this.http.post('/api/auth/login', { username, password });
  }

  rateMovie(movieId: number, rating: number) {
    return this.http.post(`/api/movies/${movieId}/rate`, { rating });
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
  }
}
