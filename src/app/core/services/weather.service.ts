import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Weather } from '../interfaces/weather';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}
  getWeather(): Observable<Weather> {
    if (!environment.weatherUrl) {
      return throwError(new Error('Weather is not configured.'));
    }
    return this.http.get<Weather>(environment.weatherUrl);
  }
}
