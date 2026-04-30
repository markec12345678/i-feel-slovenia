import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const cityCoords: Record<string, { lat: number; lon: number }> = {
  'Bled': { lat: 46.3683, lon: 14.1144 },
  'Ljubljana': { lat: 46.0569, lon: 14.5058 },
  'Postojna': { lat: 45.7753, lon: 14.2292 },
  'Piran': { lat: 45.5245, lon: 13.5673 },
  'Bovec': { lat: 46.3453, lon: 13.5604 },
};

export function useWeather(city: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const coords = cityCoords[city];
    if (!coords) {
      setError('City not found');
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();

        const weatherCode = data.current.weather_code;
        const condition = getWeatherCondition(weatherCode);
        const icon = getWeatherIcon(weatherCode);

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition,
          icon,
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
}

function getWeatherCondition(code: number): string {
  if (code === 0) return 'Jasno';
  if (code <= 3) return 'Delno oblačno';
  if (code <= 48) return 'Megla';
  if (code <= 67) return 'Dež';
  if (code <= 77) return 'Sneg';
  if (code <= 82) return 'Plohe';
  if (code <= 86) return 'Snegene plohe';
  if (code <= 99) return 'Nevihta';
  return 'Neznano';
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '⛈️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}
