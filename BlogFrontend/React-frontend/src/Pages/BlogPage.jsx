import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants/links';
import Searchbar from '../Components/Searchbar.jsx';
import {
    BlogCardsA,
    BannerCard,
    BlogCardsB,
    BlogCardsC,
    BlogCardsD,
    BlogCardsE,
} from '../Components/BlogCards.jsx';
import Footer from '../Components/Footer.jsx';

const SearchResults = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No posts found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
                <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    className="block group"
                >
                    <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                            src={post.featuredImage?.url || '/blog banner.png'}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                            <p className="text-sm text-gray-500 mb-1">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <h3 className="text-lg font-bold leading-tight line-clamp-2">
                                {post.title}
                            </h3>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const shuffleArray = (array) => {
    if (!array) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const BlogPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    console.log('Render BlogPage, searchQuery:', searchQuery);

    const {
        data: allPosts,
        isLoading: isLoadingAllPosts,
        error: errorAllPosts,
    } = useQuery({
        queryKey: ['posts', searchQuery],
        queryFn: async () => {
            console.log('useQuery for search running with query:', searchQuery);
            const url = searchQuery
                ? `${API_URL}/api/posts/search?q=${encodeURIComponent(
                      searchQuery
                  )}`
                : `${API_URL}/api/posts`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const result = await response.json();
            return result.data;
        },
    });

    const {
        data: popularPosts,
        isLoading: isLoadingPopularPosts,
        error: errorPopularPosts,
    } = useQuery({
        queryKey: ['popularPosts'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/posts/popular`);
            if (!response.ok) {
                throw new Error('Failed to fetch popular posts');
            }
            const result = await response.json();
            return result.data;
        },
        enabled: !searchQuery,
    });

    const {
        data: editorPicksPosts,
        isLoading: isLoadingEditorPicksPosts,
        error: errorEditorPicksPosts,
    } = useQuery({
        queryKey: ['editorPicksPosts'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/posts/editor-picks`);
            if (!response.ok) {
                throw new Error('Failed to fetch editor picks posts');
            }
            const result = await response.json();
            return result.data;
        },
        enabled: !searchQuery,
    });

    const recentPosts = useMemo(() => {
        if (!allPosts) return [];
        return [...allPosts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [allPosts]);

    const postsForD = recentPosts.slice(0, 10);

    const remainingPosts = useMemo(() => {
        if (!allPosts) return [];
        const recentPostIds = new Set(postsForD.map((p) => p._id));
        return allPosts.filter((p) => !recentPostIds.has(p._id));
    }, [allPosts, postsForD]);

    const postsForA = remainingPosts.slice(0, 5);
    const postsForE = remainingPosts.slice(5, 10);

    const handleSearch = (query) => {
        console.log('handleSearch called with:', query);
        setSearchQuery(query);
    };

    const isLoading =
        isLoadingAllPosts ||
        (isLoadingPopularPosts && !searchQuery) ||
        (isLoadingEditorPicksPosts && !searchQuery);

    const error =
        errorAllPosts ||
        (!searchQuery && (errorPopularPosts || errorEditorPicksPosts));

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
                {searchQuery ? (
                    <SearchResults posts={allPosts} />
                ) : (
                    <>
                        <BlogCardsA posts={postsForA} />
                        <BannerCard post={editorPicksPosts?.[0]} />
                        <BlogCardsB posts={popularPosts} />
                        <BlogCardsC posts={editorPicksPosts?.slice(1) || []} />
                        <BlogCardsD posts={postsForD} />
                        <BlogCardsE posts={postsForE} />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage;
