import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const tourismKnowledge = {
  'bled': 'Blejsko jezero je najlepše jezero v Sloveniji. Na otoku je cerkev Marijinega vnebovzetja, ki jo lahko obiščete s pletno. Grad Bled ponuja čudovit razgled na jezero in Julijske Alpe.',
  'postojna': 'Postojnska jama je 24 km dolga in je največja jamski sistem v Sloveniji. Vlak vas pelje globoko v jamo, kjer lahko vidite kapnike in edinstvenega človeško ribico.',
  'ljubljana': 'Ljubljana je prestolnica Slovenije z 295.000 prebivalci. Znana je po Zmajevem mostu, Ljubljanskem gradu in zelenem središču mesta.',
  'triglav': 'Triglav je najvišji vrh Slovenije z 2864 metri. Je del Triglavskega narodnega parka in simbol slovenskega naroda.',
  'soca': 'Reka Soča je znana po svoji smaragdno zeleni barvi. Je priljubljena za kajakarjenje, ribolov in rafting.',
  'piran': 'Piran je obmorno mesto v Istri, znano po svoji beneški arhitekturi, solinah in čudovitih sončnih zahodih.',
  'kako do': 'Do Slovenije lahko pridete z letalom (Ljubljana Jože Pučnik, Maribor, Portorož), z vlakom iz Avstrije, Italije ali Madžarske, ali z avtomobilom.',
  'kaj': 'V Sloveniji lahko planinjenje, kolesarite, obiskujete jame, uživate v termah, raziskujete kulinariko ali pa se sprostite na obali.',
  'kajen': 'Najboljši čas za obisk je od maja do oktobra. Pozimi je odlično za smučanje v Alpskih centrih.',
  'hrana': 'Poskusite prekmursko gibanico, potico, kranjsko klobaso, štruklje, pršut in slovenska vina.',
  'default': 'Zanima me več o Sloveniji! Vprašajte me o Bledu, Postojnski jami, Ljubljani, Triglavu, Soči, Piranu, ali o temu kako do nas, kaj početi, kdaj obiskati ali hrani.',
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Pozdravljen! Sem vaš turistični pomočnik za Slovenijo. Kaj vas zanima?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(tourismKnowledge)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        return value;
      }
    }
    return tourismKnowledge.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-slovenia-green hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        } items-center gap-2`}
        aria-label="Odpri turistični pomočnik"
      >
        <MessageSquare size={24} />
        <span className="font-semibold hidden sm:inline">Pomočnik</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md glass rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-slovenia-green to-slovenia-lake flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="text-white" size={24} />
                <div>
                  <h3 className="font-bold text-white">Turistični pomočnik</h3>
                  <p className="text-xs text-white/70">AI asistent za Slovenijo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Zapri"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' ? 'bg-slovenia-lake' : 'bg-slovenia-green'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-slovenia-lake text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Vprašajte o Sloveniji..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-slovenia-green transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-slovenia-green hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
                  aria-label="Pošlji sporočilo"
                >
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
