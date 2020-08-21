import { Component, OnInit } from '@angular/core';
import { Weather} from "../../core/interfaces/weather";
import { WeatherService} from "../../core/services/weather.service";

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnInit {

  weather: Weather = {
    current: {
      temp: 0,
      weather: [
        {
          description: '',
          icon: ''
        }
      ]
    },
    lat: 0,
    lon: 0,
    daily: {},
    timezone_offset: 0
  };
  panelOpenState: boolean = false;
  currentTime: Date =  new Date();

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherService.getWeather()
      .subscribe( response => this.weather = response);
  }

}
