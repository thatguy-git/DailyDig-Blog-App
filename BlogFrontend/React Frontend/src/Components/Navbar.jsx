import React from 'react'

const Navbar = () => {

    const TRANSITION_CLASSES = "transition duration-300 ease-out";


    return (
        <nav className="bg-zinc-400/30 p-0 mx-0 rounded-b-md shadow-lg sticky top-0 z-10 backdrop-blur-sm">
            <div className="container mx-auto flex justify-between items-center w-full">
                <img src="\blog_logo-removebg-preview.png" alt="Logo" className="w-20"/>
                <ul className="flex space-x-24 px-8">
                    <li><a className={`${TRANSITION_CLASSES} text-zinc-900 hover:text-zinc-500 text-lg hover:underline-offset-4 hover:underline font-normal cursor-pointer tracking-tighter`}>Home</a></li>
                    <li><a className={`${TRANSITION_CLASSES} text-zinc-900 hover:text-zinc-500 text-lg hover:underline-offset-4 hover:underline font-normal cursor-pointer tracking-tighter`}>About Us</a></li>
                    <li><a className={`${TRANSITION_CLASSES} text-zinc-900 hover:text-zinc-500 text-lg hover:underline-offset-4 hover:underline font-normal cursor-pointer tracking-tighter`}>Contact Us</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
