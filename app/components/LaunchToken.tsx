import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function LaunchToken() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  
  // Update image preview when file is selected
  useEffect(() => {
    if (tokenImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(tokenImage);
    } else {
      setImagePreviewUrl('');
    }
  }, [tokenImage]);

  const handleLaunch = async () => {
    if (!publicKey || !tokenImage) {
      toast.error('Please connect your wallet and select a token image');
      return;
    }
    
    if (!tokenName || !tokenSymbol) {
      toast.error('Please fill in token name and symbol');
      return;
    }
    
    setIsLoading(true);
    
    try {
      toast.loading('Preparing token launch on LetsBonk.fun...');

      // Sichere Validierung ohne automatische Transaktionen
      toast.success('Token launch preparation complete!', {
        description: 'LetsBonk.fun integration coming soon - your token details are ready',
        action: {
          label: 'Learn More',
          onClick: () => window.open('https://letsbonk.fun', '_blank')
        }
      });

    } catch (error) {
      console.error("Launch failed:", error);
      toast.error('Failed to prepare token launch', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="bg-[#0a0a0a] border border-green-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="border-b border-green-500/20 p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl font-medium text-green-400">Create New Token</h2>
            </div>
            <p className="mt-2 text-sm text-gray-400">Launch your token on LetsBonk.fun - the secure Solana launchpad.</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Token Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Token Name</label>
                <input
                  type="text"
                  placeholder="My Awesome Token"
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Token Symbol</label>
                <input
                  type="text"
                  placeholder="MAT"
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Description</label>
              <textarea
                placeholder="Describe your token..."
                className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white h-20 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Token Image */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Token Image</label>
              <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 text-center">
                {imagePreviewUrl ? (
                  <div className="space-y-2">
                    <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 mx-auto rounded" />
                    <p className="text-sm text-gray-400">{tokenImage?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-8 h-8 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">Click to upload token image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="token-image"
                  onChange={(e) => setTokenImage(e.target.files?.[0] || null)}
                />
                <label htmlFor="token-image" className="cursor-pointer text-green-400 hover:text-green-300">
                  Choose File
                </label>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Website</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Telegram</label>
                <input
                  type="text"
                  placeholder="https://t.me/your-group"
                  className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 px-6 py-4 border-t border-green-500/20">
            <button
              onClick={handleLaunch}
              disabled={isLoading || !tokenName || !tokenSymbol || !tokenImage}
              className="w-full bg-green-500 text-black py-2.5 px-4 rounded-md font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing Launch...
                </span>
              ) : (
                'Prepare Token Launch'
              )}
            </button>
            <p className="mt-2 text-xs text-center text-gray-400">
              Secure token launch via LetsBonk.fun - no automatic transactions
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="w-80">
        <div className="bg-[#0a0a0a] border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-4">Token Preview</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white">{tokenName || 'Token Name'}</h4>
              <p className="text-sm text-gray-400">{tokenSymbol || 'TICKER'}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">LetsBonk.fun</span>
                <span className="text-xs text-gray-400">$0</span>
              </div>
            </div>

            {/* Social Links */}
            {(website || telegram) && (
              <div className="flex gap-2">
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
                {telegram && (
                  <a href={telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Platform: LetsBonk.fun</p>
              <p>Status: Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 