import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { AboutUsBody } from '../Components/AboutUsComponents.jsx';

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <div className="mt-8">
                <AboutUsBody />
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
