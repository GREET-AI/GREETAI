'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import GreetGhost from './GreetGhost';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function RegisterModal({ isOpen, onClose, walletAddress }: RegisterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null);
  const [showGreetGhost, setShowGreetGhost] = useState(false);
  const [greetMessage, setGreetMessage] = useState('');

  // Show GREET Ghost immediately when modal opens
  useEffect(() => {
    if (isOpen) {
      setGreetMessage("YO ANON! 🔥 Welcome to GREET AI! I'm your personal guide through the most degen Solana launchpad! Connect your X account to get started and earn 100 GREET instantly! Don't worry, I'll never post without your permission! 💚");
      setShowGreetGhost(true);
    } else {
      setShowGreetGhost(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Handle messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
        setIsTwitterConnected(true);
        setTwitterUsername(event.data.username);
        toast.success('Successfully connected X account!');
        
        // Show GREET Ghost with success message
        setGreetMessage(`YO ANON! 🔥 You just connected your wallet with @${event.data.username}! This is your GREET AI account - you're now part of the family! Click 'Start' and let's get this bread! 💚`);
        setShowGreetGhost(true);
      } else if (event.data.type === 'TWITTER_AUTH_ERROR') {
        toast.error(event.data.error || 'Failed to connect X account');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  const handleTwitterConnect = async () => {
    try {
      // Store wallet address in session storage for after OAuth redirect
      sessionStorage.setItem('pendingWalletAddress', walletAddress);
      
      // Open Twitter OAuth in a popup with wallet address
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const encodedWallet = encodeURIComponent(walletAddress);
      window.open(
        `/api/auth/twitter?wallet=${encodedWallet}`,
        'Connect with X',
        `width=${width},height=${height},left=${left},top=${top},popup=true`
      );
    } catch (error) {
      console.error('Error connecting X:', error);
      toast.error('Failed to connect X');
    }
  };

  const handleStart = () => {
    // Just close the modal - user is already registered via X connect
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-black border border-green-500 p-6 rounded-lg w-[480px] max-w-full mx-4">
          <h2 className="text-2xl font-chippunk text-green-500 mb-2">Welcome to GREET</h2>
          
          {/* Benefits Section */}
          <div className="mb-6 bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h3 className="text-lg font-chippunk text-green-400 mb-2">Connect & Earn Rewards 🎁</h3>
            <ul className="space-y-2 text-sm text-green-300/80">
              <li className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                Get 100 GREET tokens instantly for connecting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                Launch your own tokens with zero fees
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                Earn rewards through community engagement
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                Access exclusive quests & airdrops
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-green-500 font-chippunk mb-2">
                Connect X {isTwitterConnected && `(Connected as @${twitterUsername})`}
              </label>
              <button
                type="button"
                onClick={handleTwitterConnect}
                disabled={isTwitterConnected}
                className="w-full bg-black text-white border border-white rounded p-3 font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image 
                  src="/x-logo.svg" 
                  alt="X" 
                  width={20} 
                  height={20} 
                  className="invert group-hover:invert-0 transition-all" 
                />
                {isTwitterConnected ? 'Connected with X' : 'Connect with X'}
              </button>
              <p className="mt-2 text-xs text-green-500/60">We&apos;ll never post without your permission</p>
            </div>
            <div>
              <label className="block text-green-500 font-chippunk mb-2">
                Wallet Address
              </label>
              <div className="w-full bg-black/50 border border-green-500 rounded p-2 text-green-500 font-mono text-sm break-all">
                {walletAddress}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-black transition font-chippunk"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStart}
                disabled={!isTwitterConnected}
                className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 transition font-chippunk disabled:opacity-50"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GREET Ghost */}
      <GreetGhost
        message={greetMessage}
        isVisible={showGreetGhost}
        onClose={() => setShowGreetGhost(false)}
        autoHide={false}
      />
    </>
  );
} 