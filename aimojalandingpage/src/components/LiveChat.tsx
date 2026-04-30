import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Download, RefreshCw } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isItinerary?: boolean;
  itinerary?: ItineraryDay[];
}

interface TripPlan {
  days: number;
  budget: 'low' | 'medium' | 'high';
  interests: string[];
  travelers: number;
}

interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  cost: string;
  type: 'sightseeing' | 'food' | 'adventure' | 'relax' | 'transport';
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
  dailyCost: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Pozdravljeni! 👋 Sem vaš slovenski potovalni asistent. Lahko vam pomagam z informacijami o Sloveniji ALI ustvarim personaliziran potovalni načrt.\n\n✨ Vpišite "NAČRTUJ" za začetek načrtovanja potovanja po Sloveniji!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planStep, setPlanStep] = useState(0);
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    days: 3,
    budget: 'medium',
    interests: [],
    travelers: 2
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Slovenian destinations data for itinerary generation
  const destinations = {
    lake: [
      { name: 'Blejsko jezero', activity: 'Vožnja z lojntrom na otok', cost: '€18' },
      { name: 'Vintgar', activity: 'Sprehod skozi sotesko', cost: '€15' },
      { name: 'Bled', activity: 'Kremšnita na kavarni', cost: '€6' },
      { name: 'Ojstrica', activity: 'Razgledna točka', cost: '€0' }
    ],
    capital: [
      { name: 'Ljubljana', activity: 'Obisk gradu', cost: '€13' },
      { name: 'Prešernov trg', activity: 'Sprehod po starem mestu', cost: '€0' },
      { name: 'Tivoli', activity: 'Park Tivoli', cost: '€0' },
      { name: 'Tržnica', activity: 'Odprta kuhinja', cost: '€15' }
    ],
    coast: [
      { name: 'Piran', activity: 'Sprehod ob sončnem zahodu', cost: '€0' },
      { name: 'Portorož', activity: 'Plaža', cost: '€0' },
      { name: 'Sečoveljske soline', activity: 'Muzej solinarstva', cost: '€10' },
      { name: 'Tartini trg', activity: 'Morska večerja', cost: '€25' }
    ],
    cave: [
      { name: 'Postojnska jama', activity: 'Ogled jame z vlakcem', cost: '€28' },
      { name: 'Predjamski grad', activity: 'Ogled gradu', cost: '€15' },
      { name: 'Park Škocjanske jame', activity: 'Sprehod po kanjonu', cost: '€16' }
    ],
    mountain: [
      { name: 'Triglavski NP', activity: 'Vintgar ali slap Savica', cost: '€15' },
      { name: 'Bohinj', activity: 'Jezero Bohinj', cost: '€0' },
      { name: 'Vogel', activity: 'Vzpenjača', cost: '€23' },
      { name: 'Slap Savica', activity: 'Vodopad', cost: '€3' }
    ],
    valley: [
      { name: 'Dolina Soče', activity: 'Most na Soči', cost: '€0' },
      { name: 'Velika Korita', activity: 'Soteska', cost: '€5' },
      { name: 'Tolmin', activity: 'Tolminska korita', cost: '€8' },
      { name: 'Bovec', activity: 'Rafting', cost: '€55' }
    ]
  };

  const interests = [
    { id: 'nature', label: '🏔️ Narava & Gore', icon: '🏔️' },
    { id: 'culture', label: '🏛️ Kultura & Zgodovina', icon: '🏛️' },
    { id: 'food', label: '🍷 Kulinarika & Vino', icon: '🍷' },
    { id: 'adventure', label: '⚡ Pustolovščine', icon: '⚡' },
    { id: 'relax', label: '🧘 Sprostitev', icon: '🧘' },
    { id: 'city', label: '🏙️ Mesta', icon: '🏙️' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Call Gemini API for AI responses
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return getBotResponse(userMessage);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Ti si slovenski potovalni asistent za spletno stran "I Feel Slovenia". Odgovarjaj v slovenščini. Pomagaj uporabniku z informacijami o Sloveniji - destinacijah, kulturi, kuhinji, prevozu, proračunu in potovanjih. Bodi prijazen, informativen in spodbujaj uporabnika, da uporabi AI planer z vnosom "NAČRTUJ".\n\nUporabnikovo vprašanje: ${userMessage}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return aiResponse + '\n\n✨ Za personaliziran načrt vpišite NAČRTUJ';
      }
      
      return getBotResponse(userMessage);
    } catch (error) {
      console.error('Gemini API error:', error);
      return getBotResponse(userMessage);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickResponses = [
    'NAČRTUJ',
    'Najboljši čas za obisk?',
    'Obvezni ogledi',
    'Lokalna kuhinja'
  ];

  // Generate AI itinerary based on user preferences
  const generateItinerary = (plan: TripPlan): ItineraryDay[] => {
    const itinerary: ItineraryDay[] = [];
    const regionOrder = ['capital', 'lake', 'mountain', 'cave', 'coast', 'valley'];
    const selectedRegions: (keyof typeof destinations)[] = [];

    // Select regions based on interests
    if (plan.interests.includes('nature')) {
      selectedRegions.push('lake', 'mountain', 'valley');
    }
    if (plan.interests.includes('culture')) {
      selectedRegions.push('capital', 'cave');
    }
    if (plan.interests.includes('city')) {
      selectedRegions.push('capital');
    }
    if (plan.interests.includes('relax')) {
      selectedRegions.push('coast', 'lake');
    }
    if (plan.interests.includes('adventure')) {
      selectedRegions.push('valley', 'mountain');
    }
    if (plan.interests.includes('food')) {
      selectedRegions.push('capital', 'coast', 'lake');
    }

    // Default to all if no interests selected
    if (selectedRegions.length === 0) {
      selectedRegions.push(...regionOrder as (keyof typeof destinations)[]);
    }

    // Generate days
    for (let day = 1; day <= plan.days; day++) {
      const regionIndex = (day - 1) % selectedRegions.length;
      const region = selectedRegions[regionIndex] as keyof typeof destinations;
      const spots = destinations[region];
      if (!spots || spots.length === 0) continue;
      const dailyActivities: ItineraryActivity[] = [];
      const firstSpot = spots[0];
      const secondSpot = spots[1];

      if (!firstSpot) continue;

      // Morning
      dailyActivities.push({
        time: '09:00',
        activity: firstSpot.activity,
        location: firstSpot.name,
        cost: plan.budget === 'low' ? '€0-15' : firstSpot.cost,
        type: 'sightseeing'
      });

      // Lunch
      if (plan.interests.includes('food')) {
        dailyActivities.push({
          time: '13:00',
          activity: 'Lokalna kosilo',
          location: firstSpot.name,
          cost: plan.budget === 'low' ? '€8' : plan.budget === 'medium' ? '€15' : '€30',
          type: 'food'
        });
      }

      // Afternoon
      if (secondSpot) {
        dailyActivities.push({
          time: '15:00',
          activity: secondSpot.activity,
          location: secondSpot.name,
          cost: plan.budget === 'low' ? '€0-10' : secondSpot.cost,
          type: 'adventure'
        });
      }

      // Evening
      if (plan.budget === 'high' || plan.interests.includes('food')) {
        dailyActivities.push({
          time: '19:00',
          activity: 'Večerja v tradicionalni gostilni',
          location: firstSpot.name,
          cost: plan.budget === 'low' ? '€12' : plan.budget === 'medium' ? '€25' : '€50',
          type: 'food'
        });
      }

      const dailyCost = calculateDailyCost(dailyActivities);

      itinerary.push({
        day,
        title: `Dan ${day}: ${getRegionName(region as string)}`,
        activities: dailyActivities,
        dailyCost
      });
    }

    return itinerary;
  };

  const getRegionName = (region: string): string => {
    const names: { [key: string]: string } = {
      capital: 'Ljubljana & Okolica',
      lake: 'Blejsko Jezero',
      coast: 'Slovenska Obala',
      cave: 'Kras & Jama',
      mountain: 'Triglavski NP & Gore',
      valley: 'Dolina Soče'
    };
    return names[region] || region;
  };

  const calculateDailyCost = (activities: ItineraryActivity[]): string => {
    let total = 0;
    activities.forEach(act => {
      const cost = parseInt(act.cost.replace(/[^0-9]/g, '')) || 0;
      total += cost;
    });
    return `~€${total}-${total + 20}`;
  };

  const handlePlanStep = (response: string) => {
    switch (planStep) {
      case 1: // Days
        const days = parseInt(response);
        if (days && days >= 1 && days <= 14) {
          setTripPlan(prev => ({ ...prev, days }));
          setPlanStep(2);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: 'Odlično! Zdaj izberite vaš proračun:\n\n💰 NIZEK (€50/dan) - Hostli, ulična hrana\n\n💰💰 SREDNJI (€100/dan) - Hoteli 3*, restavracije\n\n💰💰💰 VISOK (€200/dan) - Luksuz, gourmet',
            sender: 'bot',
            timestamp: new Date()
          }]);
        }
        break;
      case 2: // Budget
        const budgetMap: { [key: string]: 'low' | 'medium' | 'high' } = {
          'nizek': 'low', 'srednji': 'medium', 'visok': 'high',
          'low': 'low', 'medium': 'medium', 'high': 'high',
          '1': 'low', '2': 'medium', '3': 'high'
        };
        const budget = budgetMap[response.toLowerCase().trim()];
        if (budget) {
          setTripPlan(prev => ({ ...prev, budget }));
          setPlanStep(3);
          const interestOptions = interests.map(i => `${i.icon} ${i.label}`).join('\n');
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `Super! Zdaj izberite interese (napišite številke, npr. "1,3,5"):\n\n${interestOptions}`,
            sender: 'bot',
            timestamp: new Date()
          }]);
        }
        break;
      case 3: // Interests
        const selectedIndices = response.split(/[,\s]+/).map(n => parseInt(n) - 1).filter(n => !isNaN(n) && n >= 0 && n < interests.length);
        const selectedInterests = selectedIndices.map(i => interests[i]?.id).filter(Boolean) as string[];
        if (selectedInterests.length > 0) {
          setTripPlan(prev => ({ ...prev, interests: selectedInterests }));
          setPlanStep(4);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: 'Koliko potnikov bo potovalo? (napišite število)',
            sender: 'bot',
            timestamp: new Date()
          }]);
        }
        break;
      case 4: // Travelers
        const travelers = parseInt(response);
        if (travelers && travelers >= 1) {
          const finalPlan = { ...tripPlan, travelers };
          setTripPlan(finalPlan);
          setPlanStep(0);
          setIsPlanning(false);

          // Generate itinerary
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: '⏳ Generiram vaš personaliziran potovalni načrt po Sloveniji...',
            sender: 'bot',
            timestamp: new Date()
          }]);

          setTimeout(() => {
            const itinerary = generateItinerary(finalPlan);
            // const totalCost = calculateTotalCost(itinerary);

            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              text: `✨ Vaš potovalni načrt je pripravljen!`,
              sender: 'bot',
              isItinerary: true,
              itinerary: itinerary,
              timestamp: new Date()
            }]);
          }, 2000);
        }
        break;
    }
  };

  const exportToText = (itinerary: ItineraryDay[]) => {
    const plan = tripPlan;
    let text = '🗺️ MOJ POTOVAlNI NAČRT PO SLOVENIJI\n\n';
    text += `Dni: ${itinerary.length}\n`;
    text += `Proračun: ${plan.budget}\n`;
    text += `Potniki: ${plan.travelers}\n\n`;

    itinerary.forEach((day: ItineraryDay) => {
      text += `📅 ${day.title}\n`;
      text += `Dnevni strošek: ${day.dailyCost}\n\n`;
      day.activities.forEach((act: ItineraryActivity) => {
        text += `  🕐 ${act.time} - ${act.activity}\n`;
        text += `  📍 ${act.location} (${act.cost})\n\n`;
      });
      text += '---\n\n';
    });

    text += 'Ustvarjeno z I Feel Slovenia AI Planerjem\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moj-slovenski-načrt.txt';
    a.click();
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Handle planning mode
    if (isPlanning && planStep > 0) {
      handlePlanStep(text);
      return;
    }

    // Check for planer trigger
    if (text.toUpperCase() === 'NAČRTUJ' || text.toLowerCase().includes('načrtuj')) {
      setIsPlanning(true);
      setPlanStep(1);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: '🎯 Začnemo z načrtovanjem! Koliko dni načrtujete potovanje po Sloveniji? (1-14)',
        sender: 'bot',
        timestamp: new Date()
      }]);
      return;
    }

    setIsTyping(true);

    // Use Gemini API for AI responses
    const botResponse = await callGeminiAPI(text);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase();

    if (lower.includes('time') || lower.includes('when') || lower.includes('best') || lower.includes('čas')) {
      return 'Najboljši čas za obisk Slovenije je od aprila do oktobra. Poletje (junij-avgust) je popolno za pohodništvo in aktivnosti na prostem, pomlad in jesen pa ponujata manj gneče in milejše vreme. Zima je odlična za smučanje v Alpah! ⛷️\n\n✨ Ali želite ustvariti personaliziran načrt? Vpišite NAČRTUJ';
    }

    if (lower.includes('get around') || lower.includes('transport') || lower.includes('travel') || lower.includes('premik')) {
      return 'Slovenija ima odličen javni prevoz! Avtobusi povezujejo vsa večja mesta, vlaki pa so udobni za daljše razdalje. Najem avtomobila je priporočljiv za raziskovanje narodnih parkov in oddaljenih predelov. Preverite naš Vodnik po prevozu za več podrobnosti! 🚌🚄\n\n✨ Ali želite ustvariti personaliziran načrt? Vpišite NAČRTUJ';
    }

    if (lower.includes('budget') || lower.includes('cost') || lower.includes('money') || lower.includes('proračun')) {
      return 'Slovenija je precej ugodna! Proračunski popotniki lahko pridejo skozi z €50-70/dan vključno s hostelom in lokalno hrano. Popotniki srednjega razreda naj predvidijo €100-150/dan za hotele in restavracije. Uporabite naš Pretvornik valut za tečaje! 💶\n\n✨ Ali želite ustvariti personaliziran načrt? Vpišite NAČRTUJ';
    }

    if (lower.includes('attraction') || lower.includes('see') || lower.includes('visit') || lower.includes('ogled')) {
      return 'Obvezni ogledi vključujejo Blejsko jezero, Postojnsko jamo, Ljubljanski grad, Triglavski narodni park in dolino Soče. Vsak ponuja edinstvene izkušnje - od romantičnih voženj z lojntrom do pustolovskih pohodov! 🏔️🏰\n\n✨ Ali želite ustvariti personaliziran načrt? Vpišite NAČRTUJ';
    }

    if (lower.includes('food') || lower.includes('cuisine') || lower.includes('eat') || lower.includes('hrana')) {
      return 'Ne spreglejte tradicionalnih slovenskih jedi kot so kremšnita, potica in jota. Poskusite lokalna vina in obiščite naš Vodnik po kuhinji za priporočila restavracij! 🍷🍰\n\n✨ Ali želite ustvariti personaliziran načrt? Vpišite NAČRTUJ';
    }

    return 'Z veseljem vam pomagam! Lahko me vprašate o najboljšem času za obisk, možnostih prevoza, proračunskih nasvetih, obveznih ogledih ali lokalni kuhinji.\n\n✨ Za personaliziran načrt vpišite NAČRTUJ 😊';
  };

  const resetPlanner = () => {
    setTripPlan({ days: 3, budget: 'medium', interests: [], travelers: 2 });
    setPlanStep(0);
    setIsPlanning(false);
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
        >
          <MessageCircle size={28} className="text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 z-50 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Slovenski asistent</h3>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Na voljo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[340px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-green-400 to-blue-500'
                    }`}>
                      {message.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                    </div>
                    <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}>
                        <div>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.isItinerary && message.itinerary && (
                    <div className="mt-4 space-y-4">
                      {message.itinerary.map((day) => (
                        <div key={day.day} className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📅</span>
                            <h4 className="text-white font-semibold text-sm">{day.title}</h4>
                            <span className="text-green-400 text-xs ml-auto">{day.dailyCost}</span>
                          </div>
                          <div className="space-y-2">
                            {day.activities.map((act, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <span className="text-gray-400 w-10 flex-shrink-0">{act.time}</span>
                                <div className="flex-1">
                                  <p className="text-gray-200">{act.activity}</p>
                                  <p className="text-gray-500">📍 {act.location} • {act.cost}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => exportToText(message.itinerary!)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                          <Download size={14} />
                          Shrani načrt
                        </button>
                        <button
                          onClick={resetPlanner}
                          className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw size={14} />
                          Nov načrt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick responses */}
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response) => (
                    <button
                      key={response}
                      onClick={() => handleSendMessage(response)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Vnesite sporočilo..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
