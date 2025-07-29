import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userMessage, walletConnected, firstBotMessage } = await req.json();

  // Baue die Nachrichtenliste für Gemini
  const messages = [
    {
      role: 'user',
      parts: [{
        text: `You are GREET, a degen Solana ghost. Always answer in a funny, degen, crypto-meme style. If the user is toxic, roast them gently. The user's wallet is ${walletConnected ? 'connected' : 'not connected'}. If the wallet is not connected, encourage the user to connect it in a degen way before they can pump or send GREET. User message: ${userMessage}`
      }]
    }
  ];

  // API-Keys (möglicherweise abgelaufen)
  const apiKeys = [
    'AIzaSyD8UNnNS9wcp2ReVVAi2iRvZq4yCiAg2PE',
    'AIzaSyDZ93djmNzYIRkFs8qxTJmRPWVaYf_fPxM'
  ];

  // Versuche zuerst die Gemini API mit Timeout
  for (const apiKey of apiKeys) {
    try {
      console.log(`Trying Gemini API with key: ${apiKey.substring(0, 10)}...`);
      
      // Timeout nach 5 Sekunden
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      console.log('Gemini API response status:', response.status);
      
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log('Gemini API success!');
        return NextResponse.json({ reply: data.candidates[0].content.parts[0].text });
      } else if (data.error?.code === 429 || data.error?.code === 503) {
        console.log(`API error (${data.error.code}) for key ${apiKey.substring(0, 10)}..., trying next one...`);
        continue;
      } else {
        console.log('Gemini API error:', data.error);
        throw new Error('Gemini API error: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error(`Gemini API error with key ${apiKey.substring(0, 10)}...:`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request timed out, trying next key...');
      }
      continue;
    }
  }
  
  // Fallback responses wenn alle API-Keys fehlschlagen
  console.error('All Gemini API keys failed, using fallback responses');
  
  if (!walletConnected) {
    const fallbackResponses = [
      // Direkte Aufforderungen
      "YO ANON! 🔥 Your wallet is as empty as a bear's portfolio! Connect that bad boy and let's get this bread! 💰",
      "BRO! You're more disconnected than my ex! Connect your wallet and let's make some gains! 🚀",
      "SER! Your wallet is offline like a boomer's phone! Connect it and let's pump some GREET! 📈",
      
      // Fragen
      "FAM! You're missing out on the biggest alpha! Connect your wallet and join the GREET army! ⚡",
      "DEGEN! Your wallet is as lonely as a whale in a kiddie pool! Connect it and let's moon! 🌙",
      
      // Humorvolle Vergleiche
      "LMAO your wallet is more disconnected than my grandma's internet! Time to connect and get some GREET gains! 🔥",
      "Bruh moment... your wallet is offline like a Nokia 3310. Connect it and let's make some noise! 📱",
      
      // Degen-Style
      "NGMI if you don't connect that wallet rn! GREET is about to moon and you're sitting here like a paper hand! 💎",
      "Seriously? You're gonna miss the GREET pump because your wallet is chilling offline? That's peak NGMI behavior! 😤",
      
      // Motivierende
      "Listen up, anon! The GREET community is waiting for you. Connect that wallet and let's make history together! ⚡",
      "Your future self will thank you for connecting that wallet now. GREET is the way! 🚀",
      
      // Sarcastic
      "Oh look, another anon without a connected wallet. How original! 🙄 Connect it and let's get this bread!",
      "Wow, you really chose to stay disconnected? Bold strategy, Cotton. Let's see if it pays off... (spoiler: it won't) 😏",
      
      // Short & Sweet
      "Wallet = Connect. GREET = Moon. You = NGMI if you don't. Simple math! 📊",
      "No wallet, no GREET, no gains. Your move! 🎯",
      
      // Story-style
      "Once upon a time, there was an anon who didn't connect their wallet. They missed the GREET pump and lived happily never after. Don't be that anon! 📖",
      
      // Technical
      "ERROR 404: Wallet connection not found. Please connect your wallet to access GREET features. 🔧",
      
      // FOMO-inducing
      "While you're reading this, someone just made 100x on GREET. Connect your wallet or keep watching from the sidelines! 👀",
      
      // Community-focused
      "The GREET fam is growing by the second! Connect your wallet and become part of the most degen community in crypto! 🤝",
      
      // Meme references
      "This is the way... to connect your wallet and join the GREET army! This is the way! 🛡️",
      
      // Time pressure
      "Tick tock, anon! GREET is pumping and you're still wallet-less. Time is money, and you're losing both! ⏰",
      
      // Achievement unlocked
      "Achievement Unlocked: 'Wallet Disconnected' - Now unlock 'GREET Gains' by connecting that bad boy! 🏆"
    ];
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return NextResponse.json({ reply: randomResponse });
  } else {
    const fallbackResponses = [
      // Positive reinforcement
      "YO! Your wallet is connected and ready to pump! Let's make some GREET gains! 🚀",
      "BRO! You're all set up! Time to shill some GREET and make it viral! 📈",
      "SER! Wallet connected and ready to moon! Let's get this GREET party started! ⚡",
      
      // Encouraging
      "FAM! You're locked and loaded! Time to spread the GREET gospel! 🔥",
      "DEGEN! You're ready to make history! Let's pump this GREET to the moon! 🌙",
      
      // Action-oriented
      "Perfect! Now let's get this GREET bread! What's your next move, ser? 💪",
      "Wallet connected = ✅. Now let's make some GREET magic happen! ✨",
      
      // Community building
      "Welcome to the GREET fam! Your wallet is connected and you're ready to make waves! 🌊",
      "You're officially part of the GREET army now! Let's show the world what we're made of! ⚔️",
      
      // Achievement unlocked
      "Achievement Unlocked: 'Wallet Connected' - You're now ready to earn GREET rewards! 🏆",
      
      // Technical confirmation
      "Connection status: ✅ WALLET CONNECTED. GREET protocol: ACTIVE. Ready for action! 🔧",
      
      // Motivational
      "You've taken the first step! Now let's make GREET the most viral token in crypto! 🎯",
      "Your wallet is connected and the GREET universe is yours to explore! 🌌",
      
      // Humorous
      "Look at you, all connected and stuff! Now let's make some GREET gains and flex on the haters! 💪",
      "Wallet connected, GREET activated, gains incoming! You're basically a crypto wizard now! 🧙‍♂️",
      
      // Short & Sweet
      "Connected! Let's GREET! 🚀",
      "Wallet ✅ GREET ✅ Gains incoming! 📈",
      
      // Story continuation
      "And so the legend begins... Your wallet is connected and the GREET saga is about to unfold! 📖",
      
      // Power level
      "Power level: OVER 9000! Your wallet is connected and you're ready to dominate! 💥",
      
      // Future-focused
      "Your future self will thank you for connecting that wallet. GREET is the future! 🔮",
      
      // Community welcome
      "Welcome to the GREET community! Your wallet is connected and you're ready to make a difference! 🤝",
      
      // Hype building
      "The GREET revolution starts with you! Wallet connected, mission active! 🎖️",
      
      // Success confirmation
      "Mission accomplished: Wallet connected! Now let's make GREET the most talked about token! 🎯",
      
      // Energy level
      "Energy level: MAXIMUM! Your wallet is connected and you're ready to pump GREET to the moon! ⚡"
    ];
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return NextResponse.json({ reply: randomResponse });
  }
} 