import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { MapPin, Star, Clock, Utensils, ExternalLink } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  specialties: string[];
  image: string;
  description: string;
  hours: string;
  website?: string;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Gostilna Pri Planincu',
    location: 'Bled',
    cuisine: 'Traditional Slovenian',
    rating: 4.8,
    priceRange: '€€',
    specialties: ['Kremšnita', 'Jota', 'Bograč'],
    image: '/restaurant-planincu.jpg',
    description: 'Family-run restaurant serving authentic Slovenian dishes since 1952. Famous for their cream cake.',
    hours: '11:00 - 22:00'
  },
  {
    id: 2,
    name: 'Restavracija Strelec',
    location: 'Ljubljana',
    cuisine: 'Modern Slovenian',
    rating: 4.7,
    priceRange: '€€€',
    specialties: ['Sea Bass', 'Truffle Pasta', 'Local Wines'],
    image: '/restaurant-strelec.jpg',
    description: 'Elegant restaurant with panoramic views of Ljubljana Castle. Modern twist on traditional recipes.',
    hours: '12:00 - 23:00'
  },
  {
    id: 3,
    name: 'Gostilna Štrukelj',
    location: 'Cerkno',
    cuisine: 'Mountain Cuisine',
    rating: 4.9,
    priceRange: '€€',
    specialties: ['Štruklji', 'Game Meat', 'Idrijski Žlikrofi'],
    image: '/restaurant-strukelj.jpg',
    description: 'Traditional family restaurant in Cerkno region. Famous for homemade dumplings and local game dishes.',
    hours: '10:00 - 21:00'
  },
  {
    id: 4,
    name: 'Ristorante Dalizia',
    location: 'Piran',
    cuisine: 'Seafood',
    rating: 4.8,
    priceRange: '€€€',
    specialties: ['Grilled Fish', 'Scampi', 'Seafood Risotto'],
    image: '/restaurant-dalizia.jpg',
    description: 'Fresh seafood right from the Adriatic. Stunning sea views and romantic atmosphere.',
    hours: '12:00 - 23:00'
  },
  {
    id: 5,
    name: 'Gostilna Oštarija',
    location: 'Postojna',
    cuisine: 'Traditional',
    rating: 4.6,
    priceRange: '€€',
    specialties: ['Roast Pork', 'Sauerkraut', 'Potato Dumplings'],
    image: '/restaurant-ostarija.jpg',
    description: 'Hearty traditional meals perfect after cave exploration. Local favorites and generous portions.',
    hours: '11:00 - 21:00',
    website: 'https://gostilnaobkaminu.si'
  },
  {
    id: 6,
    name: 'Gostilna Zlatorog',
    location: 'Bohinj',
    cuisine: 'Alpine',
    rating: 4.7,
    priceRange: '€€',
    specialties: ['Cheese Platter', 'Game Stew', 'Lake Fish'],
    image: '/restaurant-zlatorog.jpg',
    description: 'Authentic Alpine cuisine with ingredients from local farms. Cozy mountain hut atmosphere.',
    hours: '10:00 - 22:00'
  }
];

export default function CuisineGuide() {
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [ref, inView] = useInView({ threshold: 0.1 });

  const cuisines = ['all', 'Traditional Slovenian', 'Modern Slovenian', 'Seafood', 'Mountain Cuisine', 'Alpine'];
  const prices = ['all', '€', '€€', '€€€'];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = selectedPrice === 'all' || restaurant.priceRange === selectedPrice;
    return matchesCuisine && matchesPrice;
  });

  return (
    <section id="cuisine" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Taste Slovenia
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Discover the best restaurants and traditional Slovenian cuisine
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCuisine === cuisine
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {prices.map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedPrice(price)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedPrice === price
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {price === 'all' ? 'All Prices' : price}
                </button>
              ))}
            </div>
          </div>

          {/* Featured dishes */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Utensils size={24} />
              Must-Try Slovenian Dishes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Kremšnita', 'Potica', 'Jota', 'Bograč', 'Štruklji', 'Prekmurska gibanica', 'Idrijski žlikrofi', 'Ričet'].map((dish) => (
                <div
                  key={dish}
                  className="bg-gray-900/50 rounded-lg p-4 text-center hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <p className="text-white font-semibold">{dish}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurants grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {restaurant.priceRange}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                    <MapPin size={14} />
                    {restaurant.location}
                  </p>
                  <p className="text-green-400 text-sm mb-3">{restaurant.cuisine}</p>
                  <p className="text-gray-300 text-sm mb-4">{restaurant.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">{restaurant.hours}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      Obišči spletno stran
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <Utensils size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No restaurants found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
