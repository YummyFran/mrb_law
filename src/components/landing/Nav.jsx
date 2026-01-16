import React from 'react'

const Nav = () => {
    return (
        <nav className="fixed z-50 flex items-center justify-between w-full px-6 py-4 bg-black border-b border-gray-800">
            <div className="text-lg font-bold tracking-wide select-none">MRB LAW</div>

            <ul className="hidden space-x-8 text-gray-300 md:flex">
                <li><a href="#" className="transition hover:text-white">Home</a></li>
                <li><a href="#about" className="transition hover:text-white">About Us</a></li>
                <li><a href="#practice-areas" className="transition hover:text-white">Practice Areas</a></li>
                <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>

            <a href="/signin" className="hidden text-gray-400 md:block hover:text-white">
                <i className="text-2xl fa-solid fa-circle-user"></i>
            </a>
        </nav>
    )
}

export default Nav