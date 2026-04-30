import { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface TourLocation {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  hotspots: {
    x: number;
    y: number;
    label: string;
    description: string;
  }[];
}

const tourLocations: TourLocation[] = [
  {
    id: 1,
    name: 'Lake Bled',
    description: 'Experience the magical Lake Bled with its island church and castle',
    image: '/bled.jpg',
    location: 'Bled, Slovenia',
    hotspots: [
      { x: 30, y: 40, label: 'Bled Castle', description: 'Medieval castle on the cliff' },
      { x: 50, y: 50, label: 'Bled Island', description: 'Church of the Assumption' },
      { x: 70, y: 60, label: 'Pletna Boat', description: 'Traditional wooden boat' }
    ]
  },
  {
    id: 2,
    name: 'Postojna Cave',
    description: 'Explore the underground wonders of Postojna Cave',
    image: '/postojna.jpg',
    location: 'Postojna, Slovenia',
    hotspots: [
      { x: 40, y: 30, label: 'Brilliant', description: 'Famous white stalagmite' },
      { x: 60, y: 50, label: 'Cave Train', description: 'Underground railway' },
      { x: 30, y: 70, label: 'Human Fish', description: 'Unique cave inhabitant' }
    ]
  },
  {
    id: 3,
    name: 'Ljubljana Castle',
    description: 'Panoramic views from the hilltop castle of Ljubljana',
    image: '/ljubljana.jpg',
    location: 'Ljubljana, Slovenia',
    hotspots: [
      { x: 50, y: 40, label: 'Castle Tower', description: 'Best viewpoint' },
      { x: 30, y: 60, label: 'Old Town', description: 'Historic city center' },
      { x: 70, y: 70, label: 'Ljubljanica River', description: 'City river' }
    ]
  }
];

export default function VirtualTour() {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newRotation = (x / (rect.width || 1)) * 360;
      setRotation(newRotation);
    }
  };

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && containerRef.current && e.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const newRotation = (x / (rect.width || 1)) * 360;
      setRotation(newRotation);
    }
  };

  return (
    <section id="virtual-tour" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Virtual Tour
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Explore Slovenia from anywhere with our 360° virtual tours
        </p>

        <div
          ref={ref}
          className={`${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-700`}
        >
          {/* Location selector */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {tourLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(index)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedLocation === index
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>

          {/* 360° viewer */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gray-800 cursor-grab active:cursor-grabbing select-none"
          >
            <img
              src={tourLocations[selectedLocation]?.image}
              alt={tourLocations[selectedLocation]?.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-100"
              style={{
                transform: `translateX(${(rotation - 50) * 2}px) scale(1.2)`
              }}
            />

            {/* Hotspots */}
            {tourLocations[selectedLocation]?.hotspots?.map((hotspot, index) => (
              <div
                key={index}
                className={`absolute w-8 h-8 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-colors ${
                  activeHotspot === index ? 'ring-4 ring-white' : ''
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setActiveHotspot(index)}
              >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
              </div>
            ))}

            {/* Hotspot info */}
            {activeHotspot !== null && tourLocations[selectedLocation]?.hotspots?.[activeHotspot] && (
              <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold text-lg mb-1">
                  {tourLocations[selectedLocation].hotspots[activeHotspot].label}
                </h3>
                <p className="text-gray-300 text-sm">
                  {tourLocations[selectedLocation].hotspots[activeHotspot].description}
                </p>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="mt-2 text-green-400 text-sm hover:text-green-300"
                >
                  Close
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-lg rounded-lg p-3 border border-gray-700">
              <p className="text-gray-300 text-sm">
                🖱️ Drag to rotate 360°
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Click hotspots for info
              </p>
            </div>
          </div>

          {/* Location info */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              <div>
                <h3 className="text-white font-bold text-xl">
                  {tourLocations[selectedLocation]?.name}
                </h3>
                <p className="text-gray-400">{tourLocations[selectedLocation]?.location}</p>
              </div>
            </div>
            <p className="text-gray-300">
              {tourLocations[selectedLocation]?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
