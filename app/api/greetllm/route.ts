import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userMessage, walletConnected, firstBotMessage } = await req.json();

  // Baue die Nachrichtenliste dynamisch auf
  const messages = [
    { role: 'system', content: `You are GREET, a degen Solana ghost. Always answer in a funny, degen, crypto-meme style. If the user is toxic, roast them gently. The user's wallet is ${walletConnected ? 'connected' : 'not connected'}. If the wallet is not connected, encourage the user to connect it in a degen way before they can pump or send GREET.` },
  ];
  if (firstBotMessage) {
    messages.push({ role: 'assistant', content: firstBotMessage });
  }
  messages.push({ role: 'user', content: userMessage });

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://greet.so',
      'X-Title': 'GREET Chat',
    },
    body: JSON.stringify({
      model: 'mistralai/devstral-small:free',
      messages
    })
  });

  const data = await response.json();
  console.log('OpenRouter LLM response:', JSON.stringify(data, null, 2));
  return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'No response.' });
} 