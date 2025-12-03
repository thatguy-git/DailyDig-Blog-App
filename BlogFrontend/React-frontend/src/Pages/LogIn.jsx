import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import { LoginLayout } from '../Components/HomePageComponents';

export const LogIn = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <LoginLayout />
                </div>
            </div>
        </div>
    );
};
