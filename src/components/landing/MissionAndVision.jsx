import React from 'react'

const MissionAndVision = () => {
    return (
        <section id="mission-vision" className="px-6 py-14 mx-auto md:px-20 max-w-7xl">
            <h2 className="mb-10 text-3xl font-bold text-center md:text-4xl">
                Our Mission & Vision
            </h2>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="p-8 transition bg-white/10 shadow-lg rounded-2xl hover:bg-white/20">
                    <h3 className="mb-4 text-2xl font-bold text-indigo-300">Our Mission</h3>
                    <p className="leading-relaxed text-gray-300">
                        To deliver exceptional legal services through integrity, innovation, and compassion.
                    </p>
                </div>

                <div className="p-8 transition bg-white/10 shadow-lg rounded-2xl hover:bg-white/20">
                    <h3 className="mb-4 text-2xl font-bold text-indigo-300">Our Vision</h3>
                    <p className="leading-relaxed text-gray-300">
                        To be the leading digital legal solutions provider in the Philippines.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default MissionAndVision