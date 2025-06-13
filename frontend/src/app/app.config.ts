import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MovieListComponent } from './standalone/movie-list/movie-list.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: MovieListComponent }
    ])
  ]
};
