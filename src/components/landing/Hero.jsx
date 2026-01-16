import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <section
            className="relative px-6 pt-28 pb-20 text-center bg-center bg-cover md:px-20"
            style={{
                backgroundImage:
                    "url('https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/707e14fd-dc6f-4998-8179-939d324f5dba.png')",
            }}
        >
            <div className="max-w-4xl p-10 mx-auto bg-black/60 rounded-lg md:p-16 backdrop-blur-sm">
                <h1 className="text-4xl font-extrabold leading-tight select-none md:text-6xl text-shadow">
                    MRB <br /> LAW FIRM
                </h1>

                <p className="mt-4 text-lg text-gray-100 md:text-xl text-shadow">
                    Files Management with Appointment Scheduling
                </p>

                <Link href="/signin">
                    <button className="px-8 py-3 mt-8 font-semibold transition rounded-lg btn-gradient hover:brightness-110 active:scale-95 cursor-pointer">
                        Schedule a Consultation Now
                    </button>
                </Link>
            </div>
        </section>
    )
}

export default Hero