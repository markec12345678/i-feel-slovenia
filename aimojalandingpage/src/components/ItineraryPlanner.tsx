import { useState, DragEvent } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, MapPin, Plus, Trash2, Download, Share2 } from 'lucide-react';

interface ItineraryItem {
  id: string;
  destination: string;
  activity: string;
  duration: string;
  time: string;
  image: string;
}

const availableActivities: Omit<ItineraryItem, 'id' | 'time'>[] = [
  {
    destination: 'Lake Bled',
    activity: 'Island Boat Tour',
    duration: '2 hours',
    image: '/bled.jpg'
  },
  {
    destination: 'Postojna Cave',
    activity: 'Cave Exploration',
    duration: '3 hours',
    image: '/postojna.jpg'
  },
  {
    destination: 'Ljubljana',
    activity: 'Castle Tour',
    duration: '2 hours',
    image: '/ljubljana.jpg'
  },
  {
    destination: 'Soča River',
    activity: 'Kayaking Adventure',
    duration: '4 hours',
    image: '/soca.jpg'
  },
  {
    destination: 'Piran',
    activity: 'Old Town Walk',
    duration: '2 hours',
    image: '/piran.jpg'
  },
  {
    destination: 'Triglav',
    activity: 'Mountain Hike',
    duration: '6 hours',
    image: '/triglav.jpg'
  }
];

export default function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<Omit<ItineraryItem, 'id' | 'time'> | null>(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const handleDragStart = (_e: DragEvent, item: Omit<ItineraryItem, 'id' | 'time'>) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const newItem: ItineraryItem = {
        ...draggedItem,
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setItinerary([...itinerary, newItem]);
      setDraggedItem(null);
    }
  };

  const removeItem = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const exportItinerary = () => {
    const text = itinerary.map((item, index) => 
      `${index + 1}. ${item.time} - ${item.activity} at ${item.destination} (${item.duration})`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slovenia-itinerary.txt';
    a.click();
  };

  const shareItinerary = () => {
    const text = itinerary.map((item, index) => 
      `${index + 1}. ${item.activity} at ${item.destination}`
    ).join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'My Slovenia Itinerary',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Itinerary copied to clipboard!');
    }
  };

  const totalDuration = itinerary.reduce((acc, item) => {
    const hours = parseInt(item.duration);
    return acc + hours;
  }, 0);

  return (
    <section id="itinerary" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Plan Your Trip
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Drag and drop activities to create your perfect Slovenian adventure
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available activities */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={24} />
                Available Activities
              </h3>
              <div className="space-y-4">
                {availableActivities.map((activity) => (
                  <div
                    key={activity.activity}
                    draggable
                    onDragStart={(e) => handleDragStart(e, activity)}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700 hover:border-green-400 transition-all duration-300 cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={activity.image}
                        alt={activity.destination}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{activity.activity}</h4>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <MapPin size={14} />
                          {activity.destination}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                          <Clock size={14} />
                          {activity.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar size={24} />
                  Your Itinerary
                </h3>
                {itinerary.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={exportItinerary}
                      className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-400 transition-colors"
                      title="Export"
                    >
                      <Download size={20} className="text-gray-300" />
                    </button>
                    <button
                      onClick={shareItinerary}
                      className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-400 transition-colors"
                      title="Share"
                    >
                      <Share2 size={20} className="text-gray-300" />
                    </button>
                  </div>
                )}
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`min-h-[400px] bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-dashed ${
                  itinerary.length === 0 ? 'border-gray-700' : 'border-gray-600'
                } transition-all duration-300`}
              >
                {itinerary.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Calendar size={48} className="mb-4 opacity-50" />
                    <p className="text-lg">Drag activities here to start planning</p>
                    <p className="text-sm mt-2">Your itinerary will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itinerary.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700 hover:border-green-400 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <img
                            src={item.image}
                            alt={item.destination}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-bold mb-1">{item.activity}</h4>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <MapPin size={14} />
                              {item.destination}
                            </p>
                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                              <Clock size={14} />
                              {item.time} • {item.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {itinerary.length > 0 && (
                <div className="mt-6 bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Activities</p>
                      <p className="text-white font-bold text-xl">{itinerary.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Duration</p>
                      <p className="text-white font-bold text-xl">{totalDuration} hours</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Destinations</p>
                      <p className="text-white font-bold text-xl">
                        {new Set(itinerary.map(i => i.destination)).size}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
