import React from 'react';
import Footer from '../Components/Footer.jsx';
import { AboutUsBody } from '../Components/AboutUsComponents.jsx';

const AboutUs = () => {
    return (
        <div>
            <div className="mt-8">
                <AboutUsBody />
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
