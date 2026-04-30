import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function SocialShare() {
  const [copied, setCopied] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = 'Discover Slovenia - A Journey Through Paradise';

  const shareOptions = [
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(shareTitle)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="share" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-700`}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Share the Beauty of Slovenia
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Help others discover the magic of Slovenia by sharing this page
          </p>

          {/* Social share buttons */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${option.color} text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span>{option.name}</span>
              </a>
            ))}
          </div>

          {/* Copy link button */}
          <div className="flex justify-center">
            <button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* URL display */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm break-all">{shareUrl}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
