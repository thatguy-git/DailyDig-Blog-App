import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { HomePageLayout } from '../Components/HomePageComponents.jsx'

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <HomePageLayout />
            <Footer />
        </div>
    )
}

export default HomePage