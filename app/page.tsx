'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import ClientWalletButton from './components/ClientWalletButton';
import '@solana/wallet-adapter-react-ui/styles.css';
import MatrixBackground from './components/MatrixBackground';
import QuestSystem from './components/QuestSystem';
import Sidebar from './components/Sidebar';
import LaunchToken from './components/LaunchToken';
import Image from 'next/image';
import StickyHeader from './components/StickyHeader';

// Typewriter-Komponente
function Typewriter({ text, onDone }: { text: string, onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, onDone]);
  return <span className="typewriter">{displayed}</span>;
}

// LLM-API Call
async function fetchLLMReply(userMessage: string, walletConnected: boolean, firstBotMessage?: string): Promise<string> {
  const res = await fetch('/api/greetllm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage, walletConnected, firstBotMessage }),
  });
  const data = await res.json();
  return data.reply;
}

export default function Home() {
  const [isTyping, setIsTyping] = useState(true);
  const { publicKey } = useWallet();
  const [greetBalance, setGreetBalance] = useState(0);
  const [greetPot, setGreetPot] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [userPower, setUserPower] = useState(0);
  const [potentialReward, setPotentialReward] = useState(0);
  const [greetMessage, setGreetMessage] = useState('');
  const [greetRecipient, setGreetRecipient] = useState('');
  const [greetHistory, setGreetHistory] = useState<Array<{text: string, recipient?: string}>>([]);
  const [topGreeters, setTopGreeters] = useState([
    { address: '...', score: 0, rewards: 0 },
    { address: '...', score: 0, rewards: 0 },
    { address: '...', score: 0, rewards: 0 },
  ]);
  const [showRules, setShowRules] = useState(false);
  const [chatView, setChatView] = useState<'menu'|'rules'|'roadmap'|'github'|'socials'>('menu');
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isBot: boolean}>>([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('quests');

  // Bot ASCII Art je nach Status
  const botArtSleeping = `(–_–) zZz\n<)   )╯  GREET-BOT\n /   \\`;
  const botArtAwake = `(•_•)\n<)   )╯  GREET-BOT\n /   \\`;

  const degenWalletPrompts = [
    "Did you just fade your own wallet, ser? Connect and let's pump together!",
    "No wallet? That's a bigger fumble than selling the top too early.",
    "Are you paper handing your wallet connect, or just scared of rugs?",
    "You missed the entry, but you can still connect your wallet. Don't get rekt twice!",
    "No wallet, no $GREET. Are you ngmi or just testing my patience?",
    "Connect your wallet, or are you waiting for the next ATH to fade again?",
    "Fren, this isn't a testnet. Connect your wallet for mainnet vibes!",
    "You can't pump without a wallet. Don't be that guy.",
    "Is your wallet rugged, or are you just shy?",
    "No connect, no respect. Even my grandma connects her wallet.",
    "You keep typing, but without a wallet, it's just noise. Connect!",
    "Did you get liquidated or just forget your wallet, ser?",
    "No wallet? That's more bearish than a red candle on pump.fun.",
    "Connect your wallet and maybe you'll finally catch a green candle.",
    "Are you afraid of commitment, or just allergic to connecting wallets?",
    "You can't fade GREET. But you can connect your wallet.",
    "Wallet connect is the real alpha. Don't miss it.",
    "No wallet, no party. This is not a drill.",
    "You keep missing entries, don't miss this one. Connect!",
    "Even bots connect their wallets. What's your excuse?",
    "Did you just fumble your connect button? Try again, ser!",
    "No wallet? That's a classic fade. Connect and redeem yourself!",
    "Are you waiting for a dip to connect your wallet? Spoiler: It never comes.",
    "You can't get rugged if you never connect... but you also can't win. Your move!"
  ];

  const insultWords = [
    'fuck', 'shit', 'bitch', 'asshole', 'idiot', 'dumb', 'nigger', 'nigga', 'faggot', 'cunt', 'bastard', 'moron', 'retard', 'gay', 'stupid', 'loser', 'suck', 'hate', 'kill', 'die', 'crap', 'scam', 'rug', 'rekt'
  ];
  const greetMissionWords = [
    'what are you', 'who are you', 'mission', 'purpose', 'goal', 'explain', 'about', 'greet', 'token', 'send', 'how', 'why', 'do', 'work', 'function', 'meaning', 'project', 'pump', 'viral', 'crypto', 'solana', 'degen'
  ];
  const tradingWords = [
    'pump', 'moon', 'gm', 'wagmi', 'ngmi', 'ser', 'fomo', 'bullish', 'bearish', 'entry', 'exit', 'long', 'short', 'buy', 'sell', 'send', 'airdrop', 'mint', 'diamond', 'paper', 'hands', 'ath', 'floor', 'whale', 'ape', 'rekt', 'lfg', 'vibe', 'alpha', 'safu', 'meme', 'fun', 'bot', 'community', 'join', 'trader', 'legend', 'fren', 'anon', 'vibe', 'moonbag', 'ape', 'floor', 'hodl', 'dump', 'whale', 'alpha', 'memecoin', 'degen', 'fren', 'safu', 'sol', 'x', 'viral', 'pot', 'trending', 'trader', 'bot', 'OG', 'airdrop', 'moon', 'gm', 'ngmi', 'wagmi'
  ];
  const genericDegenReplies = [
    "Ser, that's not bullish. Try some good vibes instead.",
    "You wanna pump? Send GREET and let's go viral!",
    "$GREET is made to be sent. Don't fade the pump!",
    "If you don't send GREET, are you even degen?",
    "GREET's mission: get sent, get pumped, go viral. Simple.",
    "Ask me anything about $GREET, but don't be a paper hand!",
    "You type, I pump. That's the deal.",
    "Wanna join the GREET army? Just send me!",
    "No time for FUD, only pump. Send GREET!",
    "You know what to do: send GREET, ser!"
  ];

  useEffect(() => {
    if (isChatActive && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatActive]);

  const handleSendGreet = async () => {
    if (!greetMessage) return;

    try {
      const greet = {
        text: greetMessage,
        recipient: greetRecipient,
      };
      
      // Update history
      setGreetHistory(prev => [greet, ...prev]);
      
      // Clear inputs
      setGreetMessage('');
      setGreetRecipient('');
      
      // Update stats
      setUserPower(prev => prev + 1);
    } catch (error) {
      console.error('Error sending greet:', error);
    }
  };

  const handleStartChat = () => {
    if (!publicKey) {
      setIsChatActive(true);
      setChatMessages([
        { text: degenWalletPrompts[Math.floor(Math.random() * degenWalletPrompts.length)], isBot: true }
      ]);
      return;
    }
    setIsChatActive(true);
    setChatMessages([
      { text: "Welcome to GREET Command Center. How can I assist you today?", isBot: true },
      { text: "Type 'help' to see available commands.", isBot: true }
    ]);
  };

  const handleChatCommand = async (command: string) => {
    setChatMessages(prev => [
      ...prev,
      { text: command, isBot: false }
    ]);
    setIsTyping(true);
    // Erste Bot-Nachricht als Kontext holen
    const firstBotMsg = chatMessages.find(m => m.isBot)?.text;
    const reply = await fetchLLMReply(command, !!publicKey, firstBotMsg);
    setChatMessages(prev => [
      ...prev,
      { text: reply, isBot: true }
    ]);
    setIsTyping(false);
  };

  // Landing Page (Not Logged In)
  if (!publicKey) {
    return (
      <main className="h-screen bg-black text-green-500 relative overflow-hidden">
        <MatrixBackground color="#cccccc" />
        <div className="matrix-overlay"></div>

        <div className="relative z-10 container mx-auto px-4 py-8 h-full flex flex-col">
          {/* Bloody GREET title */}
          <motion.h1 
            className="text-8xl font-bold text-white mb-8 text-center bloody-text-drip"
            style={{ fontFamily: 'chippunk, sans-serif', textShadow: '0 2px 8px #00FF41, 0 4px 16px #00FF41, 0 8px 32px #00FF41' }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            GREET
          </motion.h1>

          {/* Chat window */}
          <div className="flex-1 w-[80vw] max-w-[1400px] mx-auto bg-black/50 border border-gray-800 rounded-lg p-12 mb-8 flex flex-col items-center justify-start relative">
            {/* GREET-Avatar links oben */}
            <Image 
              src="/GREET.png" 
              alt="GREET Character" 
              width={96} 
              height={96} 
              className={`w-24 h-24 object-contain select-none absolute left-0 top-0 ml-0 mt-4 z-20${chatMessages.length && chatMessages[chatMessages.length-1].isBot && isTyping ? ' animate-talk' : ''}`}
            />
            {/* User-Avatar rechts unten, direkt über dem Eingabefeld */}
            {isChatActive && (
              <Image 
                src="/boy.png" 
                alt="User Avatar" 
                width={80} 
                height={80} 
                className={`w-20 h-20 object-contain select-none absolute right-0 bottom-[90px] mr-0 z-20${chatMessages.length && !chatMessages[chatMessages.length-1].isBot && isTyping ? ' animate-talk' : ''}`}
              />
            )}
            {/* Nachrichtenbereich, Padding links und rechts für Avatare */}
            <div className="w-full max-w-5xl flex-1 flex flex-col h-[320px] overflow-y-auto bg-transparent px-2 pl-0 pr-0 custom-scrollbar" style={{ minHeight: 0 }}>
              {isChatActive && (
                <div className="w-full space-y-2">
                  {chatMessages.map((message, index) => {
                    const isLast = index === chatMessages.length - 1;
                    return (
                      <div key={index} className="flex w-full flex-row">
                        {/* GREET (Bot) Bubble: linke Hälfte */}
                        <div className="w-1/2 flex items-start">
                          {message.isBot && (
                            <div className="relative max-w-full bg-green-900/80 border-2 border-green-400 rounded-2xl p-2 mb-1 text-left shadow-[0_0_16px_2px_#00FF41] ml-4 text-base font-tech z-10">
                              <span className="block text-green-300 font-bold mb-0.5 text-xs">GREET:</span>
                              {isLast ? (
                                <Typewriter text={message.text} />
                              ) : (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-green-100">{message.text}</pre>
                              )}
                              {/* Pfeil links */}
                              <span className="absolute -left-2 bottom-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-green-400"></span>
                            </div>
                          )}
                        </div>
                        {/* User Bubble: rechte Hälfte */}
                        <div className="w-1/2 flex items-end justify-end">
                          {!message.isBot && (
                            <div className="relative max-w-full bg-[#ab9ff2] border-2 border-[#ab9ff2] rounded-2xl p-2 mb-1 text-right shadow-[0_0_8px_2px_#ab9ff2] mr-4 text-base font-tech font-bold text-[#2d225a] z-10">
                              <span className="block text-[#2d225a] font-bold mb-0.5 text-xs">You:</span>
                              {isLast ? (
                                <Typewriter text={message.text} />
                              ) : (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-[#2d225a]">{message.text}</pre>
                              )}
                              {/* Pfeil rechts */}
                              <span className="absolute -right-2 bottom-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-[#ab9ff2]"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Bot tippt ... Animation */}
                  {isTyping && (
                    <div className="flex w-full flex-row">
                      <div className="w-1/2 flex items-start">
                        <div className="relative max-w-full bg-green-900/80 border-2 border-green-400 rounded-2xl p-2 mb-1 text-left shadow-[0_0_16px_2px_#00FF41] ml-4 text-base font-tech z-10">
                          <span className="block text-green-300 font-bold mb-0.5 text-xs">GREET:</span>
                          <span className="inline-block animate-pulse">...</span>
                          <span className="absolute -left-2 bottom-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-green-400"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            {/* Eingabefeld immer unten im Chat, nur wenn aktiv */}
            {isChatActive && (
              <div className="w-full flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Talk to GREET"
                  className="flex-1 bg-black/50 border border-green-500 rounded p-2 text-green-500 font-chippunk placeholder:font-chippunk"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleChatCommand(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input');
                    if (input && input.value.trim()) {
                      handleChatCommand(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="btn bg-black border border-white text-white hover:bg-white hover:text-black transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>

          {/* Wallet connection */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <ClientWalletButton className="btn-matrix animate-pulse-wallet" />
            <span className="text-white text-lg md:text-2xl greet-glow font-chippunk">
              & GREET someone
            </span>
          </div>

          {/* Talk to GREET button */}
          {!isChatActive && (
            <div className="text-center mb-8">
              <button 
                onClick={handleStartChat}
                className="btn mx-auto block px-8 py-2 rounded border border-white bg-black text-white font-bold transition hover:bg-white hover:text-black max-w-xs w-full"
              >
                Talk to GREET
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Dashboard (Logged In)
  return (
    <main className="min-h-screen bg-black text-white">
      <StickyHeader />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="pl-[240px] p-8">
        {activeSection === 'launch' && <LaunchToken />}
        {activeSection === 'quests' && <QuestSystem />}
        
        {activeSection === 'send' && (
          <div className="bg-black/50 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Send Greet</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Twitter handle (optional)"
                className="w-full bg-black/50 border border-green-500 rounded p-2 text-green-500"
                value={greetRecipient}
                onChange={(e) => setGreetRecipient(e.target.value)}
              />
              <textarea
                placeholder="Type your greet message..."
                className="w-full bg-black/50 border border-green-500 rounded p-2 text-green-500 h-32"
                value={greetMessage}
                onChange={(e) => setGreetMessage(e.target.value)}
              />
              <button
                onClick={handleSendGreet}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Greet
              </button>
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="bg-black/50 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Greets</h2>
            <div className="space-y-2">
              {greetHistory.map((greet, index) => (
                <div key={index} className="text-green-500">
                  {greet.recipient && <span className="text-red-500">@{greet.recipient}</span>} {greet.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'holdings' && (
          <div className="space-y-8">
            <div className="bg-black/50 border border-green-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Holdings</h2>
              <div className="text-green-500">
                <p>GREET Balance: {greetBalance.toLocaleString()}</p>
                <p>Your Tier: {greetBalance >= 50000000 ? 'Diamond' : 
                             greetBalance >= 10000000 ? 'Gold' :
                             greetBalance >= 5000000 ? 'Silver' :
                             greetBalance >= 1000000 ? 'Bronze' : 'Free'}</p>
              </div>
            </div>

            <div className="bg-black/50 border border-green-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Greet Pot</h2>
              <div className="text-green-500">
                <p className="text-2xl font-bold mb-2">{(greetPot).toLocaleString()} SOL</p>
                <p className="text-sm">Next distribution in: 3d 12h</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className="bg-black/50 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4 text-green-500">
              <div className="space-y-2">
                <div>
                  <p className="text-sm opacity-75">Current Rank</p>
                  <p className="text-xl font-bold">#{userRank}</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Greet Streak</p>
                  <p className="text-xl font-bold">{userStreak} days 🔥</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm opacity-75">Greet Power</p>
                  <p className="text-xl font-bold">{userPower} ⚡</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Potential Reward</p>
                  <p className="text-xl font-bold">{potentialReward.toFixed(2)} SOL</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'leaderboard' && (
          <div className="bg-black/50 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Top Greeters</h2>
            <div className="space-y-2">
              {topGreeters.map((greeter, index) => (
                <div key={index} className="flex justify-between items-center text-green-500">
                  <span className="font-mono">#{index + 1} {greeter.address.slice(0, 4)}...{greeter.address.slice(-4)}</span>
                  <span>{greeter.rewards.toFixed(2)} SOL</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
