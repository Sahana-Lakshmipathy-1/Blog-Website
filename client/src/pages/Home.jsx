import React from 'react'
import HomeSection from '../components/HomeSection'
import Trending from '@/components/Trending'
import Stats from '@/components/Stats'

const Home = () => {
  return (
    <div>
        <HomeSection/>
        <Trending />
        <Stats/>
    </div>
  )
}

export default Home