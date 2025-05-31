'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function RegisterModal({ isOpen, onClose, walletAddress }: RegisterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null);

  useEffect(() => {
    // Handle messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
        setIsTwitterConnected(true);
        setTwitterUsername(event.data.username);
        toast.success('Successfully connected X account!');
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
      
      // Open Twitter OAuth in a popup
      const width = 600;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        '/api/auth/twitter',
        'Connect with X',
        `width=${width},height=${height},left=${left},top=${top},popup=true`
      );
    } catch (error) {
      console.error('Error connecting X:', error);
      toast.error('Failed to connect X');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTwitterConnected) {
      toast.error('Please connect your X account first');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pumpWallet: walletAddress,
          twitterUsername: twitterUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      toast.success('Successfully registered!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border border-green-500 p-6 rounded-lg w-[480px] max-w-full mx-4">
        <h2 className="text-2xl font-chippunk text-green-500 mb-2">Welcome to GREET</h2>
        
        {/* Benefits Section */}
        <div className="mb-6 bg-green-500/5 border border-green-500/20 rounded-lg p-4">
          <h3 className="text-lg font-chippunk text-green-400 mb-2">Connect & Earn Rewards 🎁</h3>
          <ul className="space-y-2 text-sm text-green-300/80">
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              Get 100 GREET tokens for connecting your X account
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              Participate in exclusive token launches
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              Earn rewards for community engagement
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              Access special quests and missions
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="mt-2 text-xs text-green-500/60">We'll never post without your permission</p>
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
              type="submit"
              disabled={isLoading || !isTwitterConnected}
              className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 transition font-chippunk disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 