import { WeatherService } from './weather.service';
it('does not contact a provider when weather is unconfigured', () => {
  const get = jasmine.createSpy();
  new WeatherService({ get } as any).getWeather().subscribe(() => fail('Unexpected data'), () => expect(get).not.toHaveBeenCalled());
});
