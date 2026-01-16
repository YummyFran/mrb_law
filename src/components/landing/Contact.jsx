import React from 'react'

const Contact = () => {
    return (
        <section id="contact" className="px-6 py-14 mx-auto md:px-20 max-w-7xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">Contact Us</h2>

            <div className="grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 text-gray-300">

                <div className="flex space-x-4">
                    <i className="text-3xl text-indigo-400 fa-solid fa-location-dot"></i>
                    <div>
                        <p className="font-semibold">Address:</p>
                        <p>Exum Bldg 1, Looc, Lapu-Lapu City</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <i className="text-3xl text-indigo-400 fa-solid fa-envelope"></i>
                    <div>
                        <p className="font-semibold">Email:</p>
                        <p className="text-indigo-400">MRBLAW@gmail.com</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <i className="text-3xl text-indigo-400 fa-solid fa-phone"></i>
                    <div>
                        <p className="font-semibold">Phone:</p>
                        <p>0967 942 489</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <i className="text-3xl text-indigo-400 fa-solid fa-business-time"></i>
                    <div>
                        <p className="font-semibold">Business Hours:</p>
                        <p>8AM – 5PM, Monday to Friday</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Contact