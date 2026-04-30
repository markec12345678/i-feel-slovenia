import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Search, MapPin, Calendar, DollarSign, Filter } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  location: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  highlights: string[];
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Lake Bled',
    location: 'Bled',
    category: 'Nature',
    price: '€€',
    rating: 4.9,
    image: '/bled.jpg',
    highlights: ['Island Church', 'Castle', 'Pletna Boat']
  },
  {
    id: '2',
    name: 'Postojna Cave',
    location: 'Postojna',
    category: 'Adventure',
    price: '€€€',
    rating: 4.8,
    image: '/postojna.jpg',
    highlights: ['Underground Train', 'Stalactites', 'Human Fish']
  },
  {
    id: '3',
    name: 'Ljubljana Castle',
    location: 'Ljubljana',
    category: 'Culture',
    price: '€',
    rating: 4.7,
    image: '/ljubljana.jpg',
    highlights: ['Panoramic Views', 'History', 'Wine Tasting']
  },
  {
    id: '4',
    name: 'Soča River',
    location: 'Bovec',
    category: 'Adventure',
    price: '€€',
    rating: 4.9,
    image: '/soca.jpg',
    highlights: ['Kayaking', 'Hiking', 'Emerald Water']
  },
  {
    id: '5',
    name: 'Piran Old Town',
    location: 'Piran',
    category: 'Culture',
    price: '€€',
    rating: 4.8,
    image: '/piran.jpg',
    highlights: ['Sunset Views', 'Seafood', 'Venetian Architecture']
  },
  {
    id: '6',
    name: 'Triglav National Park',
    location: 'Bohinj',
    category: 'Nature',
    price: '€',
    rating: 4.9,
    image: '/triglav.jpg',
    highlights: ['Hiking', 'Lakes', 'Wildlife']
  }
];

export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const categories = ['all', 'Nature', 'Adventure', 'Culture', 'Food', 'Wellness'];
  const locations = ['all', 'Bled', 'Postojna', 'Ljubljana', 'Bovec', 'Piran', 'Bohinj'];
  const prices = ['all', '€', '€€', '€€€'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || dest.location === selectedLocation;
    const matchesPrice = selectedPrice === 'all' || dest.price === selectedPrice;
    const matchesRating = dest.rating >= minRating;

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesRating;
  });

  return (
    <section id="search" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Find Your Perfect Destination
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Search and filter through Slovenia's best attractions
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <Filter size={20} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category filter */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                    <MapPin size={16} />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location filter */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc.charAt(0).toUpperCase() + loc.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price filter */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                    <DollarSign size={16} />
                    Price Range
                  </label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    {prices.map((price) => (
                      <option key={price} value={price}>
                        {price === 'all' ? 'All Prices' : price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating filter */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                    <Calendar size={16} />
                    Min Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <p className="text-gray-400 mb-6">
            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
          </p>

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-yellow-400 font-bold">★ {dest.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {dest.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    <span className="text-green-400 font-semibold">{dest.price}</span>
                  </div>
                  <p className="text-gray-400 mb-4 flex items-center gap-2">
                    <MapPin size={14} />
                    {dest.location}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dest.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No destinations found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSelectedPrice('all');
                  setMinRating(0);
                }}
                className="mt-4 text-green-400 hover:text-green-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
