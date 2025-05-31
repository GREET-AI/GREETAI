'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function RegisterModal({ isOpen, onClose, walletAddress }: RegisterModalProps) {
  const [twitterUsername, setTwitterUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitterUsername,
          pumpWallet: walletAddress,
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
      <div className="bg-black border border-green-500 p-6 rounded-lg w-96 max-w-full mx-4">
        <h2 className="text-2xl font-chippunk text-green-500 mb-4">Welcome to GREET</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="twitter" className="block text-green-500 font-chippunk mb-2">
              Twitter Username
            </label>
            <input
              id="twitter"
              type="text"
              value={twitterUsername}
              onChange={(e) => setTwitterUsername(e.target.value)}
              placeholder="@username"
              className="w-full bg-black/50 border border-green-500 rounded p-2 text-green-500 font-chippunk"
              required
            />
          </div>
          <div>
            <label className="block text-green-500 font-chippunk mb-2">
              Wallet Address
            </label>
            <div className="w-full bg-black/50 border border-green-500 rounded p-2 text-green-500 font-chippunk break-all">
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
              disabled={isLoading}
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