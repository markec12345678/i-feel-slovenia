import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  notHelpful: number;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    location: 'Lake Bled',
    rating: 5,
    date: '2025-04-20',
    text: 'Popolnoma dih jemajoče! Vožnja z lojntrom na otok je bila čarobna. Toplo priporočam obisk zgodaj zjutraj za najlepše razglede.',
    helpful: 42,
    notHelpful: 2,
    avatar: '👩'
  },
  {
    id: 2,
    author: 'Markus Schmidt',
    location: 'Postojna Cave',
    rating: 5,
    date: '2025-04-18',
    text: 'Vlakova vožnja v podzemlje je izkušnja, ki nima primerjave. Kapniki in stalagmiti so neverjetni. Obvezno ogled!',
    helpful: 38,
    notHelpful: 1,
    avatar: '👨'
  },
  {
    id: 3,
    author: 'Emma Wilson',
    location: 'Ljubljana',
    rating: 4,
    date: '2025-04-15',
    text: 'Čarobno mesto z odlično atmosfero. Razgledi s gradu so osupljivi. Edino kar mi manjka je več časa za raziskovanje.',
    helpful: 35,
    notHelpful: 3,
    avatar: '👩'
  },
  {
    id: 4,
    author: 'Carlos Rodriguez',
    location: 'Soča River',
    rating: 5,
    date: '2025-04-12',
    text: 'Kristalno čista voda, popolna za kajak. Smaragdna barva je v živo še lepša. Raj za pustolovce!',
    helpful: 40,
    notHelpful: 0,
    avatar: '👨'
  },
  {
    id: 5,
    author: 'Yuki Tanaka',
    location: 'Piran',
    rating: 5,
    date: '2025-04-10',
    text: 'Benetke Slovenije! Razgledi na sončni zahod z mestnega obzidja so nepozabni. Odlične morske restavracije.',
    helpful: 37,
    notHelpful: 1,
    avatar: '👩'
  }
];

export default function Reviews() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [userReview, setUserReview] = useState({ rating: 5, text: '' });
  const [showForm, setShowForm] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const locations = ['vse', 'Blejsko jezero', 'Postojnska jama', 'Ljubljana', 'Reka Soča', 'Piran', 'Triglav'];

  const locationMap: { [key: string]: string } = {
    'vse': 'all',
    'Blejsko jezero': 'Lake Bled',
    'Postojnska jama': 'Postojna Cave',
    'Ljubljana': 'Ljubljana',
    'Reka Soča': 'Soča River',
    'Piran': 'Piran',
    'Triglav': 'Triglav'
  };

  const filteredReviews = selectedLocation === 'vse'
    ? reviews
    : reviews.filter(r => r.location === locationMap[selectedLocation]);

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mnenje poslano! Hvala, da delite svoje izkušnje.');
    setUserReview({ rating: 5, text: '' });
    setShowForm(false);
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Mnenja popotnikov
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Preberite, kaj drugi popotniki pravijo o svojih doživetjih v Sloveniji
        </p>

        <div
          ref={ref}
          className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
        >
          {/* Rating summary */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="text-6xl font-bold text-white mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={24}
                      className={i <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <p className="text-gray-400">Na podlagi {reviews.length} mnenj</p>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 w-12 text-sm">{stars} zvezdic</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-12 text-sm">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedLocation === loc
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
              title="Razvrsti po"
            >
              <option value="recent">Najnovejše</option>
              <option value="rating">Najvišja ocena</option>
              <option value="helpful">Najbolj uporabno</option>
            </select>
          </div>

          {/* Write review button */}
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              {showForm ? 'Prekliči' : 'Napiši mnenje'}
            </button>
          </div>

          {/* Review form */}
          {showForm && (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Napiši oceno</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Ocena</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserReview({ ...userReview, rating: i })}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          i <= userReview.rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-text" className="block text-gray-300 mb-2 font-semibold">
                    Vaše mnenje
                  </label>
                  <textarea
                    id="review-text"
                    value={userReview.text}
                    onChange={(e) => setUserReview({ ...userReview, text: e.target.value })}
                    placeholder="Delite svoje izkušnje..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Pošlji mnenje
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-400 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-bold">{review.author}</h4>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{review.location}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">{review.text}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                        <ThumbsUp size={16} />
                        <span>Koristno ({review.helpful})</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                        <ThumbsDown size={16} />
                        <span>Ni koristno ({review.notHelpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
