import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Connection, VersionedTransaction } from '@solana/web3.js';
import { toast } from 'sonner';

// Helper function for logging
const logStep = (step: string, data?: any) => {
  console.log(`[Token Creation - ${step}]`, data || '');
};

export default function LaunchToken() {
  const { publicKey, signTransaction } = useWallet();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [tokenBanner, setTokenBanner] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [website1, setWebsite1] = useState('');
  const [website2, setWebsite2] = useState('');
  const [telegram, setTelegram] = useState('');
  const [devBuyAmount, setDevBuyAmount] = useState('0.1');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');
  
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

  // Update banner preview when file is selected
  useEffect(() => {
    if (tokenBanner) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(tokenBanner);
    } else {
      setBannerPreviewUrl('');
    }
  }, [tokenBanner]);

  const handleLaunch = async () => {
    logStep('Started', { tokenName, tokenSymbol });
    
    if (!publicKey || !tokenImage || !signTransaction) {
      const error = {
        wallet: !publicKey ? 'Not connected' : 'Connected',
        image: !tokenImage ? 'Missing' : 'Present',
        signTransaction: !signTransaction ? 'Not available' : 'Available'
      };
      logStep('Validation Failed', error);
      toast.error('Please connect your wallet and select a token image');
      return;
    }
    
    // Validate dev buy amount
    const buyAmount = parseFloat(devBuyAmount);
    if (isNaN(buyAmount) || buyAmount <= 0) {
      logStep('Invalid Buy Amount', { providedAmount: devBuyAmount });
      toast.error('Please enter a valid dev buy amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a random keypair for token
      const mintKeypair = Keypair.generate();
      logStep('Generated Mint Keypair', { 
        publicKey: mintKeypair.publicKey.toBase58()
      });

      // Create form data for metadata
      const formData = new FormData();
      formData.append("file", tokenImage);
      formData.append("name", tokenName);
      formData.append("symbol", tokenSymbol);
      formData.append("description", description);
      formData.append("website", website1);
      formData.append("website2", website2);
      formData.append("telegram", telegram);
      formData.append("showName", "true");

      logStep('Uploading Metadata', { 
        name: tokenName,
        symbol: tokenSymbol,
        imageSize: tokenImage.size,
        hasDescription: !!description
      });

      const uploadToastId = toast.loading('Uploading token metadata...');

      // Upload metadata to IPFS
      const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
      });
      const metadataResponseJSON = await metadataResponse.json();

      toast.dismiss(uploadToastId);

      logStep('Metadata Uploaded', {
        status: metadataResponse.status,
        uri: metadataResponseJSON.metadataUri
      });

      if (!metadataResponse.ok) {
        throw new Error(`Failed to upload metadata: ${metadataResponse.statusText}`);
      }

      // Create token metadata
      const tokenMetadata = {
        name: tokenName,
        symbol: tokenSymbol,
        uri: metadataResponseJSON.metadataUri
      };

      logStep('Creating Transaction', {
        publicKey: publicKey.toBase58(),
        mint: mintKeypair.publicKey.toBase58(),
        buyAmount
      });

      const createTxToastId = toast.loading('Creating token transaction...');

      // Send the create transaction
      const response = await fetch("https://pumpportal.fun/api/trade-local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          action: "create",
          tokenMetadata: tokenMetadata,
          mint: mintKeypair.publicKey.toBase58(),
          denominatedInSol: "true",
          amount: buyAmount,
          slippage: 10,
          priorityFee: 0.0005,
          pool: "pump"
        })
      });

      toast.dismiss(createTxToastId);

      logStep('Transaction Response Received', {
        status: response.status,
        ok: response.ok
      });

      if (response.status === 200) {
        const data = await response.arrayBuffer();
        let tx = VersionedTransaction.deserialize(new Uint8Array(data));
        
        logStep('Transaction Deserialized', {
          version: tx.version
        });
        
        const signToastId = toast.loading('Please sign the transaction...');
        
        // Sign with mint keypair
        tx.sign([mintKeypair]);
        logStep('Signed with Mint Keypair');

        // Sign with wallet
        tx = await signTransaction(tx);
        logStep('Signed with Wallet');
        
        toast.dismiss(signToastId);
        const broadcastToastId = toast.loading('Broadcasting transaction...');
        
        // Send transaction to blockchain
        const web3Connection = new Connection(
          "https://rpc.helius.xyz/?api-key=1aa1b801-10ea-47eb-80b7-ca3917b2bca7",  // Using Helius endpoint
          {
            commitment: 'confirmed',
            confirmTransactionInitialTimeout: 60000
          }
        );
        
        try {
          const signature = await web3Connection.sendTransaction(tx, {
            skipPreflight: false,
            maxRetries: 3
          });
          
          toast.dismiss(broadcastToastId);
          
          logStep('Transaction Broadcasted', {
            signature,
            explorerUrl: `https://solscan.io/tx/${signature}`
          });

          toast.success('Token created successfully!', {
            description: `Transaction: ${signature}`,
            action: {
              label: 'View',
              onClick: () => window.open(`https://solscan.io/tx/${signature}`, '_blank')
            }
          });
        } catch (sendError) {
          logStep('Transaction Broadcast Failed', {
            error: sendError instanceof Error ? sendError.message : 'Unknown error'
          });
          throw new Error(`Failed to broadcast transaction: ${sendError instanceof Error ? sendError.message : 'Unknown error'}`);
        }
      } else {
        logStep('Transaction Creation Failed', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Failed to create transaction: ${response.statusText}`);
      }
      
    } catch (error) {
      logStep('Error', {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error
      });
      console.error("Launch failed:", error);
      toast.error('Failed to create token', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
      logStep('Process Completed');
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
              <h2 className="text-xl font-medium text-green-400">Create New Coin</h2>
            </div>
            <p className="mt-2 text-sm text-gray-400">Launch your token on pump.fun directly through GREET.</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Coin Name</label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full bg-black/30 border border-green-500/20 rounded-md p-2.5 text-gray-200 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="name your coin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ticker</label>
                  <input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-full bg-black/30 border border-green-500/20 rounded-md p-2.5 text-gray-200 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="add a coin ticker (e.g. DOGE)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-black/30 border border-green-500/20 rounded-md p-2.5 text-gray-200 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="write a short description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Dev Buy Amount (SOL)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={devBuyAmount}
                      onChange={(e) => setDevBuyAmount(e.target.value)}
                      step="0.1"
                      min="0.1"
                      className="w-full bg-black/30 border border-green-500/20 rounded-md p-2.5 text-gray-200 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      placeholder="0.1"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400">SOL</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 0.1 SOL recommended</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Social Links (optional)</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Website</label>
                      <input
                        type="text"
                        placeholder="https://your-website.com"
                        className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                        value={website1}
                        onChange={(e) => setWebsite1(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Twitter (X)</label>
                      <input
                        type="text"
                        placeholder="https://x.com/your-profile"
                        className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white"
                        value={website2}
                        onChange={(e) => setWebsite2(e.target.value)}
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
              </div>
            </div>

            {/* Full Width Section for Images */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Coin Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-500/20 border-dashed rounded-md hover:border-green-500/40 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setTokenImage(e.target.files?.[0] || null)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 15mb</p>
                  </div>
                </div>
                {tokenImage && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected: {tokenImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Banner Image (optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-500/20 border-dashed rounded-md hover:border-green-500/40 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setTokenBanner(e.target.files?.[0] || null)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">3:1 ratio, 1500×500px recommended</p>
                  </div>
                </div>
                {tokenBanner && (
                  <p className="mt-2 text-sm text-gray-400">
                    Selected: {tokenBanner.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 px-6 py-4 border-t border-green-500/20">
            <button
              onClick={handleLaunch}
              disabled={!publicKey || !tokenName || !tokenSymbol || !tokenImage || isLoading}
              className="w-full bg-green-500 text-black py-2.5 px-4 rounded-md font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Coin...
                </span>
              ) : (
                'Create Coin'
              )}
            </button>
            <p className="mt-2 text-xs text-center text-gray-400">
              Coin data (social links, banner, etc) can only be added now, and can't be changed or edited after creation
            </p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-[300px] sticky top-8">
        <div className="bg-[#0a0a0a] border border-green-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-green-500/20">
            <h3 className="text-green-400 font-medium">preview</h3>
          </div>
          <div className="p-4">
            {/* Banner Preview */}
            <div className="w-full h-[100px] bg-black/30 rounded-lg overflow-hidden mb-4">
              {bannerPreviewUrl ? (
                <img src={bannerPreviewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  <span>No banner image</span>
                </div>
              )}
            </div>
            
            {/* Token Image Preview */}
            <div className="aspect-square w-full bg-black/30 rounded-lg overflow-hidden mb-4">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Token Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span>No image selected</span>
                </div>
              )}
            </div>

            {/* Token Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white">{tokenName || 'Token Name'}</h4>
                <p className="text-sm text-gray-400">{tokenSymbol || 'TICKER'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">now</span>
                  <span className="text-xs text-gray-400">$0</span>
                </div>
              </div>

              {/* Social Links */}
              {(website1 || website2 || telegram) && (
                <div className="flex gap-2">
                  {website1 && (
                    <a href={website1} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                  {website2 && (
                    <a href={website2} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </a>
                  )}
                  {telegram && (
                    <a href={telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.181.344.203.483.023.139.041.562.041.562z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {description && (
                <p className="text-sm text-gray-400 line-clamp-3">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 