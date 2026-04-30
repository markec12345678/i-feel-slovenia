import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Hotel, Bed, Wifi, Car, Utensils, Star, ExternalLink } from 'lucide-react';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  image: string;
  bookingUrl: string;
}

const accommodations: Accommodation[] = [
  {
    id: 1,
    name: 'Grand Hotel Toplice',
    type: 'Luxury Hotel',
    location: 'Bled',
    pricePerNight: 250,
    rating: 4.8,
    amenities: ['Spa', 'Pool', 'Restaurant', 'Lake View'],
    image: '/bled.jpg',
    bookingUrl: '#'
  },
  {
    id: 2,
    name: 'Penzion Berc',
    type: 'Guesthouse',
    location: 'Bled',
    pricePerNight: 85,
    rating: 4.5,
    amenities: ['Breakfast', 'Parking', 'WiFi'],
    image: '/bled.jpg',
    bookingUrl: '#'
  },
  {
    id: 3,
    name: 'Hotel Lev',
    type: 'Business Hotel',
    location: 'Ljubljana',
    pricePerNight: 120,
    rating: 4.6,
    amenities: ['Gym', 'Restaurant', 'WiFi', 'Parking'],
    image: '/ljubljana.jpg',
    bookingUrl: '#'
  },
  {
    id: 4,
    name: 'Hostel Celica',
    type: 'Hostel',
    location: 'Ljubljana',
    pricePerNight: 35,
    rating: 4.4,
    amenities: ['WiFi', 'Kitchen', 'Common Area'],
    image: '/ljubljana.jpg',
    bookingUrl: '#'
  },
  {
    id: 5,
    name: 'Hotel Dobra Vila',
    type: 'Boutique Hotel',
    location: 'Bovec',
    pricePerNight: 150,
    rating: 4.7,
    amenities: ['Restaurant', 'Bar', 'Terrace', 'WiFi'],
    image: '/soca.jpg',
    bookingUrl: '#'
  },
  {
    id: 6,
    name: 'Pension Boka',
    type: 'Guesthouse',
    location: 'Bovec',
    pricePerNight: 65,
    rating: 4.3,
    amenities: ['Breakfast', 'Parking', 'Garden'],
    image: '/soca.jpg',
    bookingUrl: '#'
  }
];

export default function PriceComparison() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const locations = ['all', 'Bled', 'Ljubljana', 'Bovec', 'Piran', 'Postojna'];
  const types = ['all', 'Luksuzni hotel', 'Poslovni hotel', 'Boutique hotel', 'Penzion', 'Hostel'];

  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesLocation = selectedLocation === 'all' || acc.location === selectedLocation;
    const matchesType = selectedType === 'all' || acc.type === selectedType;
    const matchesPrice = acc.pricePerNight <= maxPrice;
    return matchesLocation && matchesType && matchesPrice;
  });

  const sortedAccommodations = [...filteredAccommodations].sort((a, b) => a.pricePerNight - b.pricePerNight);

  return (
    <section id="prices" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Primerjava cen
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Poiščite najboljše ponudbe za nastanitev v Sloveniji
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Filters */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Lokacija</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc.charAt(0).toUpperCase() + loc.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Vrsta</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'Vse' : type === 'Luksuzni hotel' ? 'Luksuzni hotel' : type === 'Poslovni hotel' ? 'Poslovni hotel' : type === 'Boutique hotel' ? 'Boutique hotel' : type === 'Penzion' ? 'Penzion' : type === 'Hostel' ? 'Hostel' : type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Najvišja cena: €{maxPrice}</label>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-green-400"
                />
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-400 mb-6">
            Najdenih {sortedAccommodations.length} nastanitev
          </p>

          {/* Comparison table */}
          <div className="space-y-4">
            {sortedAccommodations.map((acc) => (
              <div
                key={acc.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-400 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="w-full md:w-48 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{acc.name}</h3>
                        <p className="text-gray-400 text-sm">{acc.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{acc.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                      <Hotel size={14} />
                      {acc.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {acc.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {amenity === 'WiFi' && <Wifi size={12} />}
                          {amenity === 'Parking' && <Car size={12} />}
                          {amenity === 'Restaurant' && <Utensils size={12} />}
                          {amenity === 'Pool' && <Bed size={12} />}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Na noč</p>
                      <p className="text-3xl font-bold text-white">€{acc.pricePerNight}</p>
                    </div>
                    <button className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                      <ExternalLink size={16} />
                      Rezerviraj
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {sortedAccommodations.length === 0 && (
            <div className="text-center py-12">
              <Hotel size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Ni najdenih nastanitev, ki ustrezajo vašim kriterijem.</p>
              <button
                onClick={() => {
                  setSelectedLocation('all');
                  setSelectedType('all');
                  setMaxPrice(500);
                }}
                className="mt-4 text-green-400 hover:text-green-300 transition-colors"
              >
                Počisti vse filtre
              </button>
            </div>
          )}

          {/* Price tips */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Nasveti za varčevanje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Rezervirajte vnaprej</h4>
                  <p className="text-gray-400 text-sm">Prihranite do 30% z rezervacijo 2-3 mesece vnaprej</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Potujte izven sezone</h4>
                  <p className="text-gray-400 text-sm">Najboljše cene v aprilu, maju, oktobru in novembru</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Razmislite o penzionih</h4>
                  <p className="text-gray-400 text-sm">Pogosto vključujejo zajtrk in lokalno gostoljubnost</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Primerjajte več strani</h4>
                  <p className="text-gray-400 text-sm">Preverite Booking.com, Airbnb in direktne cene hotelov</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
