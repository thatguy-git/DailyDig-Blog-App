import React from 'react'

export const BannerImage = ({ imageUrl }) => {
    return (
        <div>
            <div className="hero image w-full mb-16">
                <img src={imageUrl || "/contact us.jpg"} alt="Hero Image" className="rounded-md w-full h-[400px] object-cover shadow-lg max-md:h-[250px]"/>
            </div>
        </div>
    )
};

export const ContactForm = () => {
    return(
        <div className="flex flex-col items-center justify-between w-96 max-w-md h-[500px] max-sm:mx-4">
                <input type="text" id="name" name="name" required className="bg-white w-full h-16 px-4 rounded-lg shadow-lg my-2"
                    placeholder="name" />
                
                <input type="email" id="email" name="email" required className="bg-white w-full h-16 px-4 rounded-lg shadow-lg my-2" placeholder="email" />
        
                
                <textarea id="password2" name="password2" required placeholder="subject....."
                    className="bg-white w-full pb-36 pt-4 px-4 rounded-lg shadow-lg my-2"></textarea>

                <button className="w-full bg-teal-800 text-white p-4 rounded-lg mt-4 hover:bg-teal-500">Send Message</button>
            </div>
    )
};

export const ContactInfo = () => {
    return(
        <div class="flex flex-col items-center justify-between w-96 max-w-md border-solid shadow-lg rounded-lg bg-white p-8 h-[500px] max-sm:mx-4">
                <a href="https://maps.app.goo.gl/2Puts6axavDQuusK7" class="w-full max-md:px-4">
                    <div class="flex items-center space-x-4 my-4">
                        <i class="fa-solid fa-location-dot text-2xl"></i>
                        <p class="text-lg">14C Estaport Avenue, Soluyi,<br />Gbagada, Lagos, Nigeria</p>
                    </div>
                </a>
                <a href="tel:+2349030930488" class="w-full max-md:px-4">
                    <div class="flex items-center space-x-4 my-4">
                        <i class="fa-solid fa-phone text-2xl"></i>
                        <p class="text-lg">+234 903 093 0488<br />+2349030930488</p>
                    </div>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=davidkiing1400@gmail.com&su=Hello&body=I%20wanted%20to%20reach%20out..." class="w-full max-md:px-4">    
                    <div class="flex items-center space-x-4 my-4">
                        <i class="fa-solid fa-envelope text-2xl"></i>
                        <p class="text-lg">davidkiing1400@gmail.com<br />thatguy@gmail.com</p>
                    </div>
                </a>
                <a href="https://x.com/thatXguy_?t=cZOoNL3osYF-mxiLpVey7w&s=09" class="w-full max-md:px-8">
                    <div class="flex items-center space-x-4 my-4">
                        <i class="fa-brands fa-x-twitter text-2xl"></i>
                        <p class="text-lg">thatguy_<br />@thatXguy_</p>
                    </div>
                </a>
        </div>
    )
};

export const ContactUsBody =()=>{
    return(
        <>
            
            <div class="flex flex-row max-md:flex-col items-stretch justify-center gap-24 mb-16 max-sm:px-4">
                
                <ContactInfo />
                <ContactForm />
            </div>
        </>
    )
};
