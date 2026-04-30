import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  price: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Ljubljana Summer Festival',
    date: '2025-07-01',
    time: '20:00',
    location: 'Ljubljana',
    category: 'Music',
    description: 'Annual summer festival featuring classical music, opera, and theater performances in the historic city center.',
    image: '/ljubljana.jpg',
    price: '€15-50'
  },
  {
    id: 2,
    title: 'Bled Wine Festival',
    date: '2025-08-15',
    time: '12:00',
    location: 'Bled',
    category: 'Food & Wine',
    description: 'Celebrate Slovenian wines with tastings, local cuisine, and live music by the lake.',
    image: '/bled.jpg',
    price: '€25'
  },
  {
    id: 3,
    title: 'Soča Kayaking Competition',
    date: '2025-06-20',
    time: '09:00',
    location: 'Bovec',
    category: 'Sports',
    description: 'International kayaking competition on the emerald Soča River. Watch professional athletes compete.',
    image: '/soca.jpg',
    price: 'Free'
  },
  {
    id: 4,
    title: 'Piran Seafood Festival',
    date: '2025-09-05',
    time: '11:00',
    location: 'Piran',
    category: 'Food & Wine',
    description: 'Taste the freshest seafood from the Adriatic coast prepared by local chefs.',
    image: '/piran.jpg',
    price: '€30'
  },
  {
    id: 5,
    title: 'Triglav Mountain Marathon',
    date: '2025-07-20',
    time: '06:00',
    location: 'Bohinj',
    category: 'Sports',
    description: 'Challenge yourself with a marathon through the stunning Triglav National Park.',
    image: '/triglav.jpg',
    price: '€45'
  },
  {
    id: 6,
    title: 'Postojna Cave Night Tour',
    date: '2025-08-10',
    time: '21:00',
    location: 'Postojna',
    category: 'Adventure',
    description: 'Special night tour of the caves with dramatic lighting and live music.',
    image: '/postojna.jpg',
    price: '€35'
  }
];

export default function EventsCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const categories = ['all', 'Music', 'Food & Wine', 'Sports', 'Adventure', 'Culture'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const matchesMonth = eventDate.getMonth() === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const navigateMonth = (direction: number) => {
    setSelectedMonth(prev => {
      const newMonth = prev + direction;
      if (newMonth < 0) return 11;
      if (newMonth > 11) return 0;
      return newMonth;
    });
  };

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Cultural Events
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Discover festivals, concerts, and events happening in Slovenia
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-400 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-300" />
            </button>
            <h3 className="text-2xl font-bold text-white min-w-[200px] text-center">
              {months[selectedMonth]} 2025
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-400 transition-colors"
            >
              <ChevronRight size={24} className="text-gray-300" />
            </button>
          </div>

          {/* Category filter */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-green-400 font-bold">{event.category}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  <div className="space-y-2 text-gray-400 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarIcon size={16} />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No events */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No events found for this month.</p>
            </div>
          )}

          {/* Event modal */}
          {selectedEvent && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <div
                className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedEvent.category}
                    </span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedEvent.price}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{selectedEvent.title}</h2>
                  <div className="space-y-2 text-gray-300 mb-6">
                    <p className="flex items-center gap-2">
                      <CalendarIcon size={18} />
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={18} />
                      {selectedEvent.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={18} />
                      {selectedEvent.location}
                    </p>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">{selectedEvent.description}</p>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
