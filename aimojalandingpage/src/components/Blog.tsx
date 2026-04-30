import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
      title: '10 skritih zakladov Slovenije, ki jih morate obiskati',
    excerpt: 'Odkrijte manj znane zaklade, ki Slovenijo delajo posebno. Od skritih slapov do starodavnih vasi.',
    date: '2025-04-15',
    author: 'Janez Novak',
    image: '/bled.jpg',
    category: 'Travel Tips',
    readTime: '8 min'
  },
  {
    id: 2,
    title: 'Najboljši vodnik za vzpon na Triglav',
    excerpt: 'Vse, kar morate vedeti, preden se podate na pot proti najvišjemu vrhu Slovenije.',
    date: '2025-04-10',
    author: 'Maja Horvat',
    image: '/triglav.jpg',
    category: 'Adventure',
    readTime: '12 min'
  },
  {
    id: 3,
    title: 'Tradicionalna slovenska kuhinja: Vodnik za ljubitelje hrane',
    excerpt: 'Raziskujte bogato kulinarično dediščino Slovenije skozi njene najljubše jedi in recepte.',
    date: '2025-04-05',
    author: 'Ana Kranjc',
    image: '/piran.jpg',
    category: 'Food & Culture',
    readTime: '10 min'
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState('all');

  const [ref, inView] = useInView({ threshold: 0.1 });

  const filteredPosts = category === 'all' ? blogPosts : blogPosts.filter(post => post.category === category);

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Popotniški blog
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Odkrijte zgodbe, nasvete in navdih za vašo slovensko pustolovščino
        </p>

        {/* Category filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                category === cat
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat === 'all' ? 'Vse' : cat === 'Travel Tips' ? 'Nasveti' : cat === 'Adventure' ? 'Pustolovščine' : cat === 'Food & Culture' ? 'Kultura' : cat}
            </button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-700`}
        >
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-green-400 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} branje</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Blog post modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedPost.category}
                  </span>
                  <span className="text-gray-400 text-sm">{selectedPost.date}</span>
                  <span className="text-gray-400 text-sm">{selectedPost.readTime} branje</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedPost.title}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-gray-300">{selectedPost.author}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{selectedPost.excerpt}</p>
                <p className="text-gray-400 mt-6">
                  To je predogled celotnega članka. V produkcijskem okolju bi vseboval popoln članek z podrobnimi informacijami, nasveti in priporočili.
                </p>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Zapri
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
