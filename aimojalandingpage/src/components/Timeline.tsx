import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '1991',
    title: 'Independence',
    description: 'Slovenia gained independence from Yugoslavia on June 25, 1991',
    icon: '🇸🇮'
  },
  {
    year: '2004',
    title: 'EU Membership',
    description: 'Slovenia joined the European Union and NATO',
    icon: '🇪🇺'
  },
  {
    year: '2007',
    title: 'Euro Introduction',
    description: 'Slovenia adopted the euro as its currency',
    icon: '💶'
  },
  {
    year: '2016',
    title: 'Green Capital',
    description: 'Ljubljana named European Green Capital',
    icon: '🌿'
  },
  {
    year: '2025',
    title: 'Tourism Boom',
    description: 'Record number of tourists visiting Slovenia',
    icon: '🏔️'
  }
];

export default function Timeline() {
  const [activeEvent, setActiveEvent] = useState(0);

  const [ref1, inView1] = useInView({ threshold: 0.3 });
  const [ref2, inView2] = useInView({ threshold: 0.3 });
  const [ref3, inView3] = useInView({ threshold: 0.3 });
  const [ref4, inView4] = useInView({ threshold: 0.3 });
  const [ref5, inView5] = useInView({ threshold: 0.3 });

  const refs = [ref1, ref2, ref3, ref4, ref5];
  const inViews = [inView1, inView2, inView3, inView4, inView5];

  useEffect(() => {
    const handleScroll = () => {
      refs.forEach((_, index) => {
        if (inViews[index]) {
          setActiveEvent(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [refs, inViews]);

  return (
    <section id="timeline" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Slovenia Through Time
        </h2>
        <p className="text-gray-400 text-center mb-16 text-lg">
          Journey through the milestones that shaped our nation
        </p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>

          {/* Timeline events */}
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                ref={refs[index]}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                } ${inViews[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-400 transition-all duration-300 ${
                    activeEvent === index ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/20' : ''
                  }`}>
                    <div className="flex items-center mb-3">
                      <span className="text-4xl mr-3">{event.icon}</span>
                      <span className="text-green-400 font-bold text-2xl">{event.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400">{event.description}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-4 border-gray-900">
                  <div className={`absolute inset-0 bg-white rounded-full ${activeEvent === index ? 'animate-ping' : ''}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive controls */}
        <div className="flex justify-center gap-4 mt-12">
          {timelineEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveEvent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeEvent === index
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
