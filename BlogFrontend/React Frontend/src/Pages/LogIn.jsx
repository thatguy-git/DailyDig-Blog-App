import React from 'react'
import { LoginLayout } from '../Components/HomePageComponents'

export const LogIn = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <LoginLayout />
            </div>

        </div>
    )
};

