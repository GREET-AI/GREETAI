import React from 'react'
import TwitterIcon from '../svg/twitter.svg'
import Image from 'next/image'

const Socials: React.FC = () => {
  return (
    <div className='fixed right-4 bottom-4 p-2 rounded-xl bg-white bg-opacity-40 backdrop-blur-md w-[80px]'>
      <div className='flex justify-center'>
        <a
          href='https://twitter.com/AIGreet'
          target='_blank'
          rel='noopener noreferrer'
          className='transform transition-transform duration-300 hover:-rotate-12'
        >
          <Image src={TwitterIcon} alt='X (Twitter)' height={40} />
        </a>
      </div>
    </div>
  )
}

export default Socials
