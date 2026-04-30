import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const interestOptions = [
    'Adventure & Hiking',
    'Cultural Heritage',
    'Food & Wine',
    'Nature & Wildlife',
    'City Breaks',
    'Wellness & Spa'
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && interests.length > 0) {
      setSubscribed(true);
      setEmail('');
      setInterests([]);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-700`}
        >
          {!subscribed ? (
            <>
              <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-gray-400 text-center mb-8">
                Get the latest travel tips, hidden gems, and exclusive offers delivered to your inbox
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>

                {/* Interest checkboxes */}
                <div>
                  <label className="block text-gray-300 mb-3 font-semibold">
                    What interests you?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          interests.includes(interest)
                            ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!email || interests.length === 0}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Subscribe to Newsletter
                </button>
              </form>

              <p className="text-gray-500 text-sm text-center mt-6">
                By subscribing, you agree to receive travel updates. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
              <p className="text-gray-400 mb-6">
                You've been successfully subscribed. Get ready for amazing Slovenia content!
              </p>
              <button
                onClick={() => setSubscribed(false)}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Subscribe Another Email
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
