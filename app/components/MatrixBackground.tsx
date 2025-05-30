import { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  color?: string;
}

const WORDS = [
  '$GREET', 'pump.fun', 'pumpdotfun', 'Solana', 'SOL', 'Degen', 'Trencher', 'WAGMI', 'POTOFGREET', 'viral',
  'gm', 'ngmi', 'LFG', 'moon', 'airdrop', 'meme', 'onchain', 'web3', 'NFT', 'community', 'greetbot', 'join us', 'crypto', 'X', 'bullish', 'diamond hands', 'fomo', 'rekt', 'ser', 'anon', 'vibe', 'moonbag', 'ape', 'floor', 'hodl', 'pump', 'dump', 'whale', 'alpha', 'memecoin', 'degen', 'fren', 'safu', 'sol', 'x', 'greet', 'viral', 'pump', 'fun', 'pot', 'trending', 'trader', 'bot', 'OG', 'legend', 'airdrop', 'moon', 'gm', 'ngmi', 'wagmi', 'pump', 'solana', 'greet', 'potofgreet', 'pumpdotfun', 'pump.fun', 'sol', 'crypto', 'web3', 'NFT', 'community', 'join us', 'viral', 'greetbot', 'pump', 'moon', 'bullish', 'diamond hands', 'fomo', 'rekt', 'ser', 'anon', 'vibe', 'moonbag', 'ape', 'floor', 'hodl', 'pump', 'dump', 'whale', 'alpha', 'memecoin', 'degen', 'fren', 'safu', 'sol', 'x', 'greet', 'viral', 'pump', 'fun', 'pot', 'trending', 'trader', 'bot', 'OG', 'legend', 'airdrop', 'moon', 'gm', 'ngmi', 'wagmi',
];

const GREET_EVENTS = [
  '@elonmusk just joined $GREET!',
  '@a1lon9 greeted @vitalik!',
  'User 0x123... just sent a viral greet!',
  'gm! @saylor is now a GREET degen!',
  'POTOFGREET just hit a new ATH!',
  'Someone greeted @cz_binance!',
  'A whale just sent 1M $GREET!',
  'Trending: $GREET on pump.fun',
  'viral greet by @greetbot',
  'New community member: @cryptoqueen',
];

const MatrixBackground = ({ color = '#cccccc' }: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    let frame = 0;
    function draw() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + 'px monospace';
      if (frame % 4 === 0) {
        for (let i = 0; i < drops.length; i++) {
          let text = '';
          let useEvent = false;
          if (Math.random() < 0.05) {
            text = GREET_EVENTS[Math.floor(Math.random() * GREET_EVENTS.length)];
            useEvent = true;
          } else if (Math.random() < 0.8) {
            text = WORDS[Math.floor(Math.random() * WORDS.length)];
          } else {
            text = String.fromCharCode(0x30A0 + Math.random() * 96);
          }
          ctx.fillStyle = useEvent ? '#00FF41' : color;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          ctx.fillStyle = color;
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      frame++;
    }

    let animationFrameId: number;
    function animate() {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default MatrixBackground; 