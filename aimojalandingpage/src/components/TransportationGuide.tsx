import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Bus, Train, Plane, Car, Clock, ExternalLink } from 'lucide-react';

interface TransportOption {
  id: number;
  type: 'bus' | 'train' | 'plane' | 'car';
  from: string;
  to: string;
  duration: string;
  price: string;
  frequency: string;
  description: string;
  icon: React.ReactNode;
}

const transportOptions: TransportOption[] = [
  {
    id: 1,
    type: 'bus',
    from: 'Ljubljana',
    to: 'Bled',
    duration: '1h 15m',
    price: '€8-12',
    frequency: 'Every 30 min',
    description: 'Direct bus service from Ljubljana main bus station to Bled. Scenic route through the countryside.',
    icon: <Bus size={24} />
  },
  {
    id: 2,
    type: 'train',
    from: 'Ljubljana',
    to: 'Postojna',
    duration: '1h',
    price: '€5-8',
    frequency: 'Every hour',
    description: 'Regular train service with comfortable seating. Cave is a short walk from the station.',
    icon: <Train size={24} />
  },
  {
    id: 3,
    type: 'plane',
    from: 'Ljubljana Airport',
    to: 'Bled',
    duration: '45m',
    price: '€30-50',
    frequency: 'On demand',
    description: 'Private transfer or taxi from Ljubljana Jože Pučnik Airport to Bled.',
    icon: <Plane size={24} />
  },
  {
    id: 4,
    type: 'car',
    from: 'Ljubljana',
    to: 'Bovec',
    duration: '2h',
    price: '€25-40 (rental)',
    frequency: 'Anytime',
    description: 'Scenic drive through Vršič Pass. Parking available in Bovec.',
    icon: <Car size={24} />
  },
  {
    id: 5,
    type: 'bus',
    from: 'Ljubljana',
    to: 'Piran',
    duration: '2h 30m',
    price: '€12-15',
    frequency: 'Every 2 hours',
    description: 'Direct bus service to the coast. Air-conditioned buses with WiFi.',
    icon: <Bus size={24} />
  },
  {
    id: 6,
    type: 'train',
    from: 'Ljubljana',
    to: 'Bohinj',
    duration: '1h 30m',
    price: '€6-10',
    frequency: 'Every 2 hours',
    description: 'Train to Jesenice, then bus to Bohinj. Beautiful mountain views.',
    icon: <Train size={24} />
  }
];

export default function TransportationGuide() {
  const [selectedType, setSelectedType] = useState('all');
  const [ref, inView] = useInView({ threshold: 0.1 });

  const types = ['all', 'bus', 'train', 'plane', 'car'];

  const filteredOptions = selectedType === 'all'
    ? transportOptions
    : transportOptions.filter(option => option.type === selectedType);

  return (
    <section id="transport" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Getting Around
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Transportation options to explore Slovenia
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Type filter */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type === 'bus' && <Bus size={18} />}
                {type === 'train' && <Train size={18} />}
                {type === 'plane' && <Plane size={18} />}
                {type === 'car' && <Car size={18} />}
                {type === 'all' && <span className="text-lg">🚌</span>}
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>

          {/* Transport cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-400 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{option.from} → {option.to}</h3>
                    <p className="text-gray-400 text-sm capitalize">{option.type}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={16} className="text-green-400" />
                    <span className="text-sm">{option.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400 font-bold">{option.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-sm">{option.frequency}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">{option.description}</p>

                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <ExternalLink size={16} />
                  <span>Book Now</span>
                </button>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-12 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Travel Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Buy Tickets Online</h4>
                  <p className="text-gray-400 text-sm">Save time by purchasing bus and train tickets in advance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Check Schedules</h4>
                  <p className="text-gray-400 text-sm">Some routes have limited service on weekends and holidays.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Consider Renting a Car</h4>
                  <p className="text-gray-400 text-sm">Best for exploring remote areas and national parks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Use Public Transport</h4>
                  <p className="text-gray-400 text-sm">Slovenia has excellent bus and train connections between major cities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
