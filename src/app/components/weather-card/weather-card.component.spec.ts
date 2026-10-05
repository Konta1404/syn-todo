import { throwError } from 'rxjs';
import { WeatherCardComponent } from './weather-card.component';
it('shows unavailable status after a weather failure', () => {
  const component = new WeatherCardComponent({ getWeather: () => throwError(new Error('offline')) } as any);
  component.ngOnInit(); expect(component.error).toBeTruthy();
});
