import React from 'react';
import { AddStory } from '../Components/HomePageComponents';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const WriteStory = ({ Links }) => {
    return (
        <div>
            <AddStory />
            <Footer />
        </div>
    );
};

export default WriteStory;
