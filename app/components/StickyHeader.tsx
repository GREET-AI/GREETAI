/* eslint-disable react-hooks/exhaustive-deps */
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import RegisterModal from "./RegisterModal";
import ClientWalletButton from "./ClientWalletButton";
import Image from "next/image";

const StickyHeader: React.FC = () => {
  const { publicKey } = useWallet();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (publicKey) {
        const pubKeyString = publicKey.toString();
        
        try {
          const response = await fetch(`/api/user/check?wallet=${pubKeyString}`);
          const data = await response.json();
          
          if (!data.exists) {
            setShowRegisterModal(true);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          // If we can't check, show the modal anyway
          setShowRegisterModal(true);
        }
      } else {
        setShowRegisterModal(false);
      }
    };

    checkUser();
  }, [publicKey]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black/80 border-b border-green-500/20 backdrop-blur-sm p-6 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Image 
              src="/GREET.png" 
              alt="GREET" 
              width={32} 
              height={32} 
              className="w-8 h-8 filter brightness-150"
            />
          </div>
          <div className="flex items-center space-x-4">
            <ClientWalletButton />
          </div>
        </div>
      </header>
      
      {publicKey && (
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          walletAddress={publicKey.toString()}
        />
      )}
    </>
  );
};

export default StickyHeader;
