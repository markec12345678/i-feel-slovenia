import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  feelsLike: number;
  icon: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

const weatherData: WeatherData = {
  location: 'Ljubljana',
  temp: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  wind: 12,
  feelsLike: 24,
  icon: 'cloud-sun',
  forecast: [
    { day: 'Mon', high: 24, low: 14, condition: 'Sunny' },
    { day: 'Tue', high: 22, low: 13, condition: 'Partly Cloudy' },
    { day: 'Wed', high: 20, low: 12, condition: 'Cloudy' },
    { day: 'Thu', high: 18, low: 11, condition: 'Rain' },
    { day: 'Fri', high: 21, low: 12, condition: 'Partly Cloudy' }
  ]
};

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes('sun') && !lower.includes('cloud')) return <Sun size={32} className="text-yellow-400" />;
  if (lower.includes('rain')) return <CloudRain size={32} className="text-blue-400" />;
  if (lower.includes('snow')) return <Cloud size={32} className="text-gray-300" />;
  if (lower.includes('cloud')) return <Cloud size={32} className="text-gray-400" />;
  return <Sun size={32} className="text-yellow-400" />;
};

const getForecastIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes('sun') && !lower.includes('cloud')) return <Sun size={20} className="text-yellow-400" />;
  if (lower.includes('rain')) return <CloudRain size={20} className="text-blue-400" />;
  if (lower.includes('snow')) return <Cloud size={20} className="text-gray-300" />;
  if (lower.includes('cloud')) return <Cloud size={20} className="text-gray-400" />;
  return <Sun size={20} className="text-yellow-400" />;
};

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState('Ljubljana');
  const [ref, inView] = useInView({ threshold: 0.1 });

  const cities = ['Ljubljana', 'Bled', 'Bovec', 'Piran', 'Postojna'];

  return (
    <section id="weather" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Weather Forecast
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Check the weather before your adventure
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* City selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCity === city
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Main weather card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
                  {getWeatherIcon(weatherData.condition)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-gray-400" />
                    <h3 className="text-2xl font-bold text-white">{weatherData.location}</h3>
                  </div>
                  <p className="text-gray-400">{weatherData.condition}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-6xl font-bold text-white">{weatherData.temp}°C</p>
                <p className="text-gray-400">Feels like {weatherData.feelsLike}°C</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Droplets size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Humidity</p>
                    <p className="text-white font-semibold">{weatherData.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-lg">
                    <Wind size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Wind</p>
                    <p className="text-white font-semibold">{weatherData.wind} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-day forecast */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={day.day}
                  className={`text-center p-4 rounded-xl transition-all duration-300 ${
                    index === 0 ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30' : 'bg-gray-900/50'
                  }`}
                >
                  <p className="text-white font-semibold mb-2">{day.day}</p>
                  <div className="flex justify-center mb-2">
                    {getForecastIcon(day.condition)}
                  </div>
                  <p className="text-white font-bold">{day.high}°</p>
                  <p className="text-gray-400 text-sm">{day.low}°</p>
                  <p className="text-gray-500 text-xs mt-1">{day.condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather tips */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Thermometer size={24} className="text-green-400" />
              Travel Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">☀️</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Sunny Days</h4>
                  <p className="text-gray-400 text-sm">Perfect for hiking and outdoor activities. Don't forget sunscreen!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-400">🌧️</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Rainy Days</h4>
                  <p className="text-gray-400 text-sm">Great for caves, museums, and indoor attractions. Pack an umbrella!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-gray-400">🌡️</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Temperature</h4>
                  <p className="text-gray-400 text-sm">Mountain areas can be 10°C cooler. Dress in layers!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-yellow-400">💨</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Windy Conditions</h4>
                  <p className="text-gray-400 text-sm">Check conditions before water activities on Soča River.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
