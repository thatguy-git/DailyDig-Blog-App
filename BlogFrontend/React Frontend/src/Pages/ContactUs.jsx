import React from 'react';
import Footer from '../Components/Footer.jsx';
import {
    ContactUsBody,
    BannerImage,
} from '../Components/ContactUsComponents.jsx';

const ContactUs = () => {
    return (
        <div>
            <BannerImage />
            <div className="mx-4">
                <ContactUsBody />
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
