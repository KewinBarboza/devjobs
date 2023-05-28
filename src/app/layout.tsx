import { Inter } from 'next/font/google'
import { Subtitle, Title } from '@tremor/react'
import { Filter } from '@/components/Filter'
import Footer from '@/components/Footer'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DevJobs - InfoJobs',
  description: 'Busca tu empleo con infojobs y tu usuario de GitHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className='dark:bg-slate-900 bg-white'>
        <Navbar />
        <header className='pt-24 pb-10'>
          <div>
            <Title className='dark:text-white text-center text-6xl font-regular'>Busca tu <span className='font-bold text-[#1972A3]'>Empleo</span> con GitHub</Title>
            <Subtitle className='dark:text-slate-300 text-center mb-28 text-2xl'>Descubre las mejores oportunidades según tus repositorios de GitHub</Subtitle>
            <div className="-z-10 absolute inset-0 max-w-lg m-auto h-[27rem] sm:h-64 sm:max-w-7xl gradient"></div>
          </div>
          <div className='px-10 md:px-24 mx-10 md:mx-48 mt-10'>
            <Filter />
          </div>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  )
}
