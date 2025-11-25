import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Searchbar from '../Components/Searchbar.jsx';
import Navbar from '../Components/Navbar.jsx';
import {
    BlogCardsA,
    BannerCard,
    BlogCardsB,
    BlogCardsC,
    BlogCardsD,
    BlogCardsE,
} from '../Components/BlogCards.jsx';
import Footer from '../Components/Footer.jsx';
import { useAuth } from '../constants/AuthContext.jsx';

const BlogPage = ({ Links }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: posts,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['posts', searchQuery],
        queryFn: async () => {
            const url = searchQuery
                ? `http://localhost:3000/api/posts/search?q=${encodeURIComponent(
                      searchQuery
                  )}`
                : 'http://localhost:3000/api/posts';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const result = await response.json();
            return result.data;
        },
    });

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    if (isLoading) {
        return (
            <div>
                <div className="mx-4 flex justify-center items-center min-h-screen">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading posts...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mx-4 flex justify-center items-center min-h-screen">
                    <div className="text-xl text-red-500">
                        Error loading posts: {error.message}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none; /* For Chrome, Safari, and Opera */
                }
                .no-scrollbar {
                    -ms-overflow-style: none; /* For IE and Edge */
                    scrollbar-width: none; /* For Firefox */
                }
            `}</style>

            <div className="mx-4 py-4">
                <Searchbar onSearch={handleSearch} />
            </div>
            <div className="mx-4">
                <BlogCardsA posts={posts} />
                <BannerCard post={posts?.[0]} />
                <BlogCardsB posts={posts} />
                <BlogCardsC posts={posts} />
                <BlogCardsD posts={posts} />
                <BlogCardsE posts={posts} />
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage;
