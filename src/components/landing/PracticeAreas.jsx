import React from 'react'

const PracticeAreas = () => {
    return (
        <section id="practice-areas" className="px-6 py-14 mx-auto md:px-20 max-w-7xl">
            <h2 className="mb-4 text-3xl font-bold text-center md:text-4xl">
                Our Practice Areas
            </h2>

            <p className="max-w-3xl mx-auto mb-10 font-semibold text-center text-gray-300">
                MRB Law provides expert legal representation across a wide range of practice areas.
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {[
                    "Corporate Law",
                    "Litigation",
                    "Estate Planning",
                    "Real Estate Law",
                    "Family Law",
                    "Criminal Defense",
                ].map((title, index) => (
                    <div
                        key={index}
                        className="p-6 transition bg-white/10 shadow-lg rounded-xl hover:bg-white/20"
                    >
                        <div className="flex items-center mb-4 space-x-4">
                            <div className="text-indigo-400 icon-box">
                                <i className="text-2xl fa-solid fa-gavel"></i>
                            </div>
                            <h3 className="text-xl font-semibold">{title}</h3>
                        </div>

                        <p className="mb-4 text-gray-200">
                            Expert, reliable, and professional legal services tailored to your needs.
                        </p>

                        <a href="#" className="font-semibold text-indigo-400 hover:underline">
                            Learn more →
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PracticeAreas