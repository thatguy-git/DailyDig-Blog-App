import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import {BlogCardsA, BannerCard, BlogCardsB, BlogCardsC, BlogCardsD, BlogCardsE} from '../Components/BlogCards.jsx'
import Footer from '../Components/Footer.jsx'

const BlogPage = () => {
    return (
        <div>
            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none; /* For Chrome, Safari, and Opera */
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* For IE and Edge */
                    scrollbar-width: none;  /* For Firefox */
                }
            `}</style>
            <Navbar />
            <div className="mx-4">
                <BlogCardsA />
                <BannerCard />
                <BlogCardsB />
                <BlogCardsC />
                <BlogCardsD />
                <BlogCardsE />
            </div>
            <Footer />
        </div>
    )
}

export default BlogPage