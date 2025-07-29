import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  sender: 'user' | 'greet';
  timestamp: Date;
}

interface GreetBotProps {
  currentPage?: string;
}

const GREET_PERSONALITY = {
  name: 'GREET',
  title: 'Command Center',
  traits: [
    'Dominant & Commanding',
    'Focused & Strategic',
    'Powerful & Influential',
    'Confident & Assertive',
    'Knowledgeable & Wise',
    'Mysterious & Enigmatic',
    'Professional & Business-oriented',
    'Charismatic & Engaging'
  ],
  welcomeMessages: [
    "Welcome to the GREET Command Center. I am your guide to the future of social interaction.",
    "I am GREET, the architect of viral connections. How may I assist you today?",
    "You've entered the GREET network. I am here to amplify your social presence.",
    "Welcome to the future. I am GREET, and I will show you the power of viral connections."
  ],
  responses: {
    greeting: [
      "I see you're ready to make your mark. What aspect of GREET would you like to explore?",
      "Your presence has been noted. How shall we proceed with your GREET journey?",
      "Welcome to the command center. I'm here to guide you through the GREET ecosystem."
    ],
    help: [
      "I can help you understand the GREET ecosystem, show you how to maximize your impact, or guide you through the viral mechanics.",
      "Let me show you the power of GREET. What would you like to know about our viral mechanics?",
      "I'm here to help you master the GREET system. What aspect would you like to explore?"
    ],
    default: [
      "Interesting. Let me guide you through that aspect of GREET.",
      "I understand your interest. Let me show you how GREET can help you achieve that.",
      "Your query has been processed. Here's what you need to know about GREET."
    ]
  }
};

const GreetBot: React.FC<GreetBotProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let welcomeMessage;
      
      if (currentPage) {
        // Page-specific welcome messages
        const pageMessages = {
          'dashboard': "YO ANON! 🔥 WELCOME TO GREET AI! I'M YOUR PERSONAL GUIDE THROUGH THE MOST DEGEN SOCIAL PLATFORM! Your dashboard is your command center - track your progress, view your rank, and dominate the GREET ecosystem!",
          'launchpad': "YO ANON! 🚀 READY TO LAUNCH SOME TOKENS? I'M HERE TO GUIDE YOU THROUGH THE MOST DEGEN LAUNCHPAD! Choose between Pump.fun and LetsBonk.fun - let's make some magic happen!",
          'launched-tokens': "YO ANON! 📊 CHECKING OUT YOUR LAUNCHED TOKENS? I'M HERE TO HELP YOU TRACK YOUR SUCCESS! Monitor performance, market data, and see your tokens dominate!",
          'quests': "YO ANON! 🎯 QUEST TIME! I'M YOUR PERSONAL QUEST MASTER! Complete missions, earn XP, and climb the ranks to become a GREET legend!",
          'x-post-tracker': "YO ANON! 📱 TRACKING YOUR X POSTS? I'M HERE TO HELP YOU ANALYZE YOUR VIRAL POTENTIAL! Let's make your posts go viral!",
          'send': "YO ANON! 💸 SENDING GREET TOKENS? I'M HERE TO HELP YOU BUILD CONNECTIONS! Share the future of social interaction!",
          'holdings': "YO ANON! 💎 CHECKING YOUR HOLDINGS? I'M HERE TO HELP YOU MANAGE YOUR PORTFOLIO! Track your investments and earnings!",
          'history': "YO ANON! 📜 REVIEWING YOUR GREET JOURNEY? I'M HERE TO SHOW YOU YOUR PATH TO GREATNESS! Every action counts towards your success!"
        };
        welcomeMessage = pageMessages[currentPage as keyof typeof pageMessages] || GREET_PERSONALITY.welcomeMessages[0];
      } else {
        welcomeMessage = GREET_PERSONALITY.welcomeMessages[
          Math.floor(Math.random() * GREET_PERSONALITY.welcomeMessages.length)
        ];
      }
      
      addMessage(welcomeMessage, 'greet');
    }
  }, [isOpen, messages.length, currentPage]);

  const addMessage = (text: string, sender: 'user' | 'greet') => {
    setMessages(prev => [...prev, { text, sender, timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');
    setIsTyping(true);

    // Simulate GREET's response
    setTimeout(() => {
      const response = getGreetResponse(inputValue.toLowerCase());
      addMessage(response, 'greet');
      setIsTyping(false);
    }, 1000);
  };

  const getGreetResponse = (input: string): string => {
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return GREET_PERSONALITY.responses.greeting[
        Math.floor(Math.random() * GREET_PERSONALITY.responses.greeting.length)
      ];
    }
    if (input.includes('help') || input.includes('how') || input.includes('what')) {
      return GREET_PERSONALITY.responses.help[
        Math.floor(Math.random() * GREET_PERSONALITY.responses.help.length)
      ];
    }
    return GREET_PERSONALITY.responses.default[
      Math.floor(Math.random() * GREET_PERSONALITY.responses.default.length)
    ];
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-black border-2 border-green-500 text-green-500 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-green-500/50 transition-all"
        >
          Talk with GREET
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-black border-2 border-green-500 rounded-lg w-96 h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-green-500 flex justify-between items-center">
            <div>
              <h2 className="text-green-500 font-bold text-xl">{GREET_PERSONALITY.name}</h2>
              <p className="text-green-500/70 text-sm">{GREET_PERSONALITY.title}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-green-500 hover:text-green-400"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-black'
                        : 'bg-black border border-green-500 text-green-500'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black border border-green-500 text-green-500 p-3 rounded-lg">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-green-500">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-black border border-green-500 text-green-500 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-green-400 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GreetBot; 