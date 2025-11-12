import React from 'react'

const Footer = ()=>{
    return(
        <div className='container-5 mt-40 bg-zinc-400/30 rounded-tl-lg rounded-tr-lg'>
            <footer className="bg-base-200 text-base-content p-10 max-md:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
                    <aside>
                        <img src="/blog_logo-removebg-preview.png" alt="Sample Image" className="w-32 "/>
                        <p className="font-medium">
                            THE DAILY DIG.<br />
                        </p>
                    </aside>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">Services</h6>
                        <a className="hover:text-teal-800">Branding</a>
                        <a className="hover:text-teal-800">Design</a>
                        <a className="hover:text-teal-800">Marketing</a>
                        <a className="hover:text-teal-800">Advertisement</a>
                    </nav>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">Company</h6>
                        <a className="hover:text-teal-800">About us</a>
                        <a className="hover:text-teal-800">Contact</a>
                        <a className="hover:text-teal-800">Careers</a>
                        <a className="hover:text-teal-800">Press kit</a>
                    </nav>
                    <nav className="flex flex-col space-y-2 px-12">
                        <h6 className="footer-title underline underline-offset-8 decoration-zinc-400 decoration-1">Legal</h6>
                        <a className="hover:text-teal-800">Terms of use</a>
                        <a className="hover:text-teal-800">Privacy policy</a>
                        <a className="hover:text-teal-800">Cookie policy</a>
                    </nav>
                </div>
            </footer>
        </div>
    )
};

export default Footer;