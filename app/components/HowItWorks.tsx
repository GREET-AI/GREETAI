'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('commandments');

  const coreConcept = {
    title: "THE FIRST SELF-SHILLING LAUNCHPAD",
    subtitle: "A Revolution in Token Economics",
    description: "What if a platform could promote itself? What if every success story became fuel for the next? GREET is the world's first self-sustaining launchpad ecosystem.",
    vision: "We've created something that has never existed before: a platform that grows stronger with every token launch, where success breeds success in an endless virtuous cycle.",
    mechanism: {
      title: "The GREET Flywheel",
      description: "This is how we've broken the traditional launchpad model. Instead of extracting value, we create it. Instead of competing, we collaborate. Instead of diminishing returns, we have exponential growth.",
      steps: [
        {
          phase: "LAUNCH",
          title: "Token Creation",
          description: "Anyone can launch a token through GREET AI. No barriers, no gatekeepers. Just vision and execution.",
          detail: "Every launch generates transaction fees that power the entire ecosystem."
        },
        {
          phase: "PROMOTE", 
          title: "Community Activation",
          description: "The GREET community promotes every launched token. Not just the creators, but everyone who believes in the project.",
          detail: "This creates unprecedented marketing power and genuine community engagement."
        },
        {
          phase: "GROW",
          title: "Token Success",
          description: "As tokens succeed, trading volume increases. More volume means more fees for GREET.",
          detail: "Success stories become case studies that attract more creators and investors."
        },
        {
          phase: "REWARD",
          title: "Value Distribution",
          description: "GREET uses collected fees to buy back GREET tokens from the market.",
          detail: "These tokens are then distributed as rewards to active community members."
        },
        {
          phase: "REPEAT",
          title: "Eternal Growth",
          description: "Rewarded community members become even more motivated to support new launches.",
          detail: "The cycle accelerates: more launches → more fees → more rewards → more engagement → more launches."
        }
      ]
    },
    impact: {
      title: "Why This Changes Everything",
      points: [
        "Traditional launchpads extract value from creators. GREET creates value for everyone.",
        "Instead of competing for attention, the entire community works together.",
        "Every successful token makes GREET stronger, not weaker.",
        "The platform literally promotes itself through its own success stories.",
        "We've eliminated the zero-sum game. This is positive-sum economics."
      ]
    }
  };

  const commandments = [
    {
      title: "Everyone can launch a token with GREET AI",
      description: "No barriers, no gatekeepers. If you have a vision, GREET AI makes it reality. The most accessible launchpad in crypto history. From idea to launch in minutes, not months.",
      details: "GREET AI eliminates all traditional barriers to token creation. No coding required, no complex smart contracts to write, no expensive audits needed. Just your vision and GREET AI's revolutionary technology."
    },
    {
      title: "Anyone can support any token launched on GREET",
      description: "Through the GREET app, become part of the most degen community in crypto. Support the projects you believe in and earn rewards for your loyalty.",
      details: "The GREET ecosystem is built on mutual support. Every token launched on GREET can be promoted by any user. This creates a network effect where successful projects lift the entire community."
    },
    {
      title: "You only need a Solana wallet and your X account",
      description: "That's it. No complex requirements, no bullshit. Just earn $GREET tokens through simple, transparent actions that benefit the entire ecosystem.",
      details: "We believe in simplicity and accessibility. No KYC, no complex verification processes, no hidden fees. Just connect your wallet, link your X account, and start earning immediately."
    },
    {
      title: "GREET takes a share of transaction fees",
      description: "From every token launch, GREET collects fees to power the ecosystem. These fees are reinvested into the community, creating a sustainable growth model.",
      details: "A small percentage of every transaction on GREET-launched tokens goes back to the GREET treasury. This creates a self-sustaining ecosystem where success breeds more success."
    },
    {
      title: "Fees are used to buy back GREET tokens",
      description: "Creating constant upward pressure and value for the GREET community. Every successful launch increases the value of GREET tokens for all holders.",
      details: "The buyback mechanism ensures that GREET token holders benefit from every successful project launched on the platform. This creates a virtuous cycle of growth and value creation."
    },
    {
      title: "GREET tokens are distributed as rewards",
      description: "For completing tasks, promoting tokens, and building the ecosystem. The more you contribute, the more you earn. Simple, fair, and transparent.",
      details: "Our reward system recognizes all forms of contribution. Whether you're creating content, promoting projects, or building the community, you'll be rewarded with GREET tokens."
    },
    {
      title: "You can only promote GREET-launched tokens",
      description: "To earn GREET rewards. It's a closed ecosystem that supports itself. This ensures quality and prevents spam while rewarding genuine engagement.",
      details: "By focusing exclusively on GREET-launched tokens, we create a high-quality ecosystem where every promotion adds real value. No spam, no fake projects, just genuine support."
    },
    {
      title: "Partnerships bring additional supply",
      description: "Other tokens can provide supply for airdrops through partnerships. This expands the ecosystem and creates additional earning opportunities for users.",
      details: "Strategic partnerships with other projects allow us to offer diverse rewards while maintaining the integrity of the GREET ecosystem. More partnerships mean more opportunities."
    },
    {
      title: "Everything is tracked and rewarded",
      description: "From the best dev to the sickest shiller. Every contribution matters and is recognized. Our advanced tracking system ensures fair and transparent rewards.",
      details: "Our AI-powered tracking system monitors all activities across the platform. From social media engagement to community building, every action is measured and rewarded appropriately."
    },
    {
      title: "The future is being built now",
      description: "Bonus programs, referrals, and many more features are coming. GREET is constantly evolving to provide the best possible experience for our community.",
      details: "We're just getting started. Advanced features like referral programs, tiered rewards, governance participation, and exclusive access are all in development. The best is yet to come."
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Foundation",
      items: [
        "GREET AI Launchpad Launch",
        "Basic token creation system",
        "X Post Tracker integration",
        "GREET token distribution",
        "Community building"
      ],
      status: "completed"
    },
    {
      phase: "Phase 2",
      title: "Expansion",
      items: [
        "Advanced AI features",
        "Partnership program",
        "Enhanced reward system",
        "Leaderboards & rankings",
        "Referral program"
      ],
      status: "in-progress"
    },
    {
      phase: "Phase 3",
      title: "Revolution",
      items: [
        "Cross-chain integration",
        "Advanced analytics",
        "Governance system",
        "DAO structure",
        "Ecosystem partnerships"
      ],
      status: "upcoming"
    },
    {
      phase: "Phase 4",
      title: "Dominance",
      items: [
        "Market leadership",
        "Global expansion",
        "Institutional adoption",
        "Advanced AI features",
        "Complete ecosystem"
      ],
      status: "future"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
        <div className="relative z-10 container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-chippunk bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              HOW IT WORKS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              The most degen AI launchpad ecosystem. Learn the rules, understand the system, 
              and become part of the future of token launches.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { id: 'commandments', label: '🔥 The 10 Commandments', icon: '⚡' },
            { id: 'system', label: '🧠 The System', icon: '💎' },
            { id: 'roadmap', label: '🗺️ Roadmap', icon: '🚀' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 pb-20">
        {activeTab === 'commandments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Core Concept - The Most Important */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-2xl p-8 border-2 border-green-500/50 mb-12"
            >
              {/* Main Title */}
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-chippunk bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {coreConcept.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold text-green-300 mb-4">
                  {coreConcept.subtitle}
                </h3>
                <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto">
                  {coreConcept.description}
                </p>
                <p className="text-lg text-green-300 font-mono italic max-w-5xl mx-auto">
                  {coreConcept.vision}
                </p>
              </div>

              {/* The GREET Flywheel */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-center text-green-400 mb-6">
                  {coreConcept.mechanism.title}
                </h3>
                <p className="text-lg text-gray-300 text-center mb-8 max-w-4xl mx-auto">
                  {coreConcept.mechanism.description}
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                  {coreConcept.mechanism.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-600 hover:border-green-500/50 transition-all duration-300"
                    >
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <h4 className="text-green-400 font-bold text-lg mb-2">{step.phase}</h4>
                        <h5 className="text-white font-semibold text-md mb-3">{step.title}</h5>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <p className="text-green-300 text-xs font-mono italic">
                        {step.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Impact Section */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600">
                <h3 className="text-2xl font-bold text-center text-green-400 mb-6">
                  {coreConcept.impact.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {coreConcept.impact.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-chippunk bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                THE <span className="font-mono text-6xl md:text-7xl">10</span> COMMANDMENTS OF GREET
              </h2>
              <p className="text-xl text-gray-300">
                These are not suggestions. These are the rules that will change crypto forever.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commandments.map((commandment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 min-h-[400px] flex flex-col ${
                    index === 9 ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  {/* GREET Logo */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src="/GREET.png" 
                      alt="GREET AI" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-green-400 mb-3 leading-tight">
                    {commandment.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-4 flex-grow">
                    {commandment.description}
                  </p>
                  
                  {/* Details */}
                  <div className="mt-auto">
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      {commandment.details}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-chippunk bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                THE GREET ECOSYSTEM
              </h2>
              <p className="text-xl text-gray-300">
                A closed system that supports itself. Here&apos;s how it all works together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Token Launch Flow */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-500/30"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-4">🚀 Token Launch Flow</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-300">User launches token through GREET AI</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-300">GREET collects transaction fees</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-300">Fees used to buy back GREET tokens</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <p className="text-gray-300">GREET tokens distributed as rewards</p>
                  </div>
                </div>
              </motion.div>

              {/* Reward System */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30"
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-4">💎 Reward System</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">🎯</div>
                    <p className="text-gray-300">Promote GREET-launched tokens</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">📊</div>
                    <p className="text-gray-300">Complete tasks and challenges</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">🏆</div>
                    <p className="text-gray-300">Earn bonuses and referrals</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">🔥</div>
                    <p className="text-gray-300">Become the best dev or shiller</p>
                  </div>
                </div>
              </motion.div>

              {/* Partnership System */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30"
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🤝 Partnership System</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">💼</div>
                    <p className="text-gray-300">Other tokens provide supply</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">🎁</div>
                    <p className="text-gray-300">Additional airdrops for users</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">🌐</div>
                    <p className="text-gray-300">Expanded ecosystem reach</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">🚀</div>
                    <p className="text-gray-300">Mutual growth and success</p>
                  </div>
                </div>
              </motion.div>

              {/* Tracking & Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-pink-900/50 to-red-900/50 rounded-xl p-6 border border-pink-500/30"
              >
                <h3 className="text-2xl font-bold text-pink-400 mb-4">📈 Tracking & Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">📊</div>
                    <p className="text-gray-300">Everything is tracked</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">🏆</div>
                    <p className="text-gray-300">Leaderboards and rankings</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">🎯</div>
                    <p className="text-gray-300">Performance analytics</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">🔥</div>
                    <p className="text-gray-300">Real-time rewards</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-chippunk bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                THE ROADMAP TO DOMINANCE
              </h2>
              <p className="text-xl text-gray-300">
                From foundation to global dominance. This is our path to revolutionize crypto.
              </p>
            </div>

            <div className="grid gap-8">
              {roadmap.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < roadmap.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-green-500 to-blue-500"></div>
                  )}
                  
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                      phase.status === 'upcoming' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}>
                      {phase.status === 'completed' ? '✅' :
                       phase.status === 'in-progress' ? '🔥' :
                       phase.status === 'upcoming' ? '⏳' : '🚀'}
                    </div>
                    
                    <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-green-400">{phase.phase}</h3>
                        <span className="text-xl font-chippunk text-blue-400">{phase.title}</span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {phase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <p className="text-gray-300">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HowItWorks; 