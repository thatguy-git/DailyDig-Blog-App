import React from 'react';
import Navbar from '../Components/Navbar';
import { SignupLayout } from '../Components/HomePageComponents';

const Signup = ({ Links }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
                <SignupLayout />
            </div>
        </div>
    );
};

export default Signup;
