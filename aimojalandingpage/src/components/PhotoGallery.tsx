import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  location: string;
}

const photos: Photo[] = [
  { id: 1, src: '/bled.jpg', alt: 'Lake Bled', title: 'Lake Bled', location: 'Bled, Slovenia' },
  { id: 2, src: '/postojna.jpg', alt: 'Postojna Cave', title: 'Postojna Cave', location: 'Postojna, Slovenia' },
  { id: 3, src: '/ljubljana.jpg', alt: 'Ljubljana', title: 'Ljubljana Castle', location: 'Ljubljana, Slovenia' },
  { id: 4, src: '/triglav.jpg', alt: 'Triglav', title: 'Mount Triglav', location: 'Triglav National Park' },
  { id: 5, src: '/soca.jpg', alt: 'Soča River', title: 'Soča River', location: 'Soča Valley' },
  { id: 6, src: '/piran.jpg', alt: 'Piran', title: 'Piran', location: 'Piran, Slovenia' },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState('all');

  const [ref, inView] = useInView({ threshold: 0.1 });

  const filteredPhotos = filter === 'all' ? photos : photos.filter(photo => photo.location.toLowerCase().includes(filter));

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Photo Gallery
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Explore the beauty of Slovenia through our curated collection
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {['all', 'bled', 'postojna', 'ljubljana', 'triglav', 'soca', 'piran'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === f
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-700`}
        >
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-800"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-1">{photo.title}</h3>
                  <p className="text-gray-300 text-sm">{photo.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white font-bold text-2xl mb-1">{selectedPhoto.title}</h3>
                <p className="text-gray-300">{selectedPhoto.location}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
