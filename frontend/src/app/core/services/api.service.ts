import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/movies';

  constructor(private http: HttpClient) {}

  // ✅ Beliebte Filme (optional: mit Pagination)
  getPopular(page = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/popular?page=${page}`);
  }

  // ✅ Registrierung
  register(username: string, password: string) {
    return this.http.post('http://localhost:3000/api/auth/register', { username, password });
  }

  // ✅ Login
  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/api/auth/login', { username, password });
  }

  // ✅ Bewertung absenden
  rateMovie(movieId: number, rating: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${movieId}/rate`, { rating });
  }

  // ✅ Filmsuche nach Titel
  searchMovies(query: string, page = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // ✅ Filter-Abfrage nach Genre & Jahr
  filterMovies(query: string, genre: string, year: string, rating: string, page: number = 1) {
    const params = new URLSearchParams();

    if (query) params.append('query', query);
    if (genre) params.append('genre', genre);
    if (year) params.append('year', year);
    if (rating) params.append('rating', rating);
    params.append('page', page.toString());

    return this.http.get<any[]>(`http://localhost:3000/api/movies/filter?${params.toString()}`);
  }

}
