import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="container-5 mt-40 bg-zinc-400/30 rounded-tl-lg rounded-tr-lg">
            <footer className="bg-base-200 text-base-content p-10 max-md:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
                    <aside>
                        <img
                            src="/blog_logo-removebg-preview.png"
                            alt="Sample Image"
                            className="w-32 "
                        />
                        <p className="font-medium">
                            THE DAILY DIG.
                            <br />
                        </p>
                    </aside>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">
                            Services
                        </h6>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Branding
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Design
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Marketing
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Advertisement
                        </Link>
                    </nav>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">
                            Company
                        </h6>
                        <Link
                            to="/about"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            About us
                        </Link>
                        <Link
                            to="/contact"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Contact
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Careers
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Press kit
                        </Link>
                    </nav>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">
                            Legal
                        </h6>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Terms of use
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Privacy policy
                        </Link>
                        <Link
                            to="/"
                            className="hover:text-teal-800 hover:cursor-pointer"
                        >
                            Cookie policy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
