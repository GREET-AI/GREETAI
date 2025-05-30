import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GREET - Send Spooky Greetings on Solana',
  description: 'Send mysterious and spooky greetings to your friends on Solana',
  twitter: {
    title: 'Solana Template App',
    description:
      'Start your Solana journey here, without unnecessary configuration and setup. Just clone it and code on top of it. Powered by Nightly Wallet.',
    images: 'https://solana-web3-template.nightly.app/preview.png',
    card: 'summary_large_image',
    site: '@nightly_app',
  },
  openGraph: {
    title: 'Solana Template App',
    description:
      'Start your Solana journey here, without unnecessary configuration and setup. Just clone it and code on top of it. Powered by Nightly Wallet.',
    images: 'https://solana-web3-template.nightly.app/preview.png',
    url: 'https://solana-web3-template.nightly.app',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
