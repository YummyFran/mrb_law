import React from 'react'
import Nav from './Nav'
import Hero from './Hero'
import PracticeAreas from './PracticeAreas'
import MissionAndVision from './MissionAndVision'
import About from './About'
import Contact from './Contact'

const Landing = () => {
    return (
        <div className="font-sans text-white bg-black">
            <Nav />
            <Hero />
            <PracticeAreas />
            <MissionAndVision />
            <About />
            <Contact />
        </div>
    )
}

export default Landing