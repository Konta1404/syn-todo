export interface Weather {
  daily: any;
  lat: number,
  lon: number,
  timezone_offset: number,
  current: {
    temp: number,
    weather: [
      {
        description: string,
        icon: string
      }
    ]
  },
}
