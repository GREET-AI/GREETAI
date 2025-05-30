"use client";
import dynamic from "next/dynamic";
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function ClientWalletButton(props: any) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-chippunk text-[22px] text-[#ab9ff2] select-none">PRESS</span>
      <WalletMultiButtonDynamic 
        {...props} 
        className={`wallet-adapter-button-trigger ${props.className || ''}`}
        style={{
          backgroundColor: '#ab9ff2',
          color: '#000000',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          outline: 'none',
          minWidth: '120px',
          height: '40px'
        }}
      />
    </div>
  );
} 