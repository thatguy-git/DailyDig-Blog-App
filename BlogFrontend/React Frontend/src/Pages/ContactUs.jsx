import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import {ContactUsBody, BannerImage} from '../Components/ContactUsComponents.jsx'

const ContactUs = ()=>{
    return(
        <div>
            <Navbar />
            <BannerImage />
            <div className="mx-4">
                <ContactUsBody />
            </div>
            <Footer />
        </div>
    )
};

export default ContactUs