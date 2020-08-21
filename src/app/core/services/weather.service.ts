import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Weather } from '../interfaces/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrlSevenDays = 'https://api.openweathermap.org/data/2.5/onecall?lat=42.43&lon=19.25&appid=bcdc4d4a68fbab5a142e49974cf55422&units=metric&exclude=minutely,hourly';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {

  }

  getWeather(): Observable<Weather> {
    return this.http.get<Weather>(this.apiUrlSevenDays)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('An error occurred:',   errorResponse.error.message);
    }
    else {
      console.error(
        'Backend returned code ${errorResponse.status}, '+
        'body was: ${errorResponse.error}');
    }
    return throwError(
      'Error Occurred; please try again later.');
  }

}
