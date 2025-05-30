'use client'
import { Loader } from '@react-three/drei'
import { Toaster } from 'sonner'
import Background from './components/Background'
import StickyHeader from './components/StickyHeader'
import Torus from './components/Torus/App'
import Socials from './components/Socials'
import GreetBot from './components/GreetBot'

export default function Home() {
  return (
    <>
      <Background />
      <StickyHeader />
      <Torus />
      <Toaster position='bottom-left' richColors />
      <Socials />
      <GreetBot />
      <Loader />
    </>
  )
}
