import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { useAuth } from '../constants/AuthContext.jsx';
import CommentSection from '../Components/CommentSection.jsx';
import { API_URL } from '../constants/links';

export const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const isLoggedIn = !!token || !!user;
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const {
        data: post,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['post', id, user?._id],
        queryFn: async () => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(`${API_URL}/api/posts/${id}`, {
                headers,
            });
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            const result = await response.json();
            console.log('Fetched result data:', result);

            return result.data;
        },
        onSuccess: (data) => {
            setIsLiked(data.likes?.includes(user?._id) || false);
            setLikeCount(data.likes?.length || 0);
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        retry: 1,
    });

    const { data: relatedPosts, isLoading: relatedLoading } = useQuery({
        queryKey: ['relatedPosts', id],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/posts/related/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch related posts');
            }
            const result = await response.json();
            return result.data;
        },
        enabled: !!post, // Only fetch if post is loaded
    });

    useEffect(() => {
        if (post) {
            setIsLiked(post.isLiked);
            setLikeCount(post.likeCount);
        }
    }, [post]);

    // Like mutation
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: async () => {
            console.log('likeMutation mutationFn called');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(`${API_URL}/api/posts/${id}/like`, {
                method: 'POST',
                headers,
            });
            if (!response.ok) {
                console.error(
                    'likeMutation fetch failed with status: ',
                    response.status
                );
                throw new Error('Failed to like/unlike post');
            }
            const result = await response.json();
            console.log('likeMutation fetch success response: ', result);
            return result;
        },
        onSuccess: (data) => {
            console.log('likeMutation onSuccess called with data: ', data);
            setIsLiked(data.liked);
            setLikeCount((prev) =>
                data.liked ? prev + 1 : Math.max(prev - 1, 0)
            );
            queryClient.invalidateQueries(['post', id]);
        },
        onError: (error) => {
            console.error('likeMutation onError: ', error);
        },
    });

    const handleBackToBlog = () => {
        navigate('/blog');
    };

    if (isLoading) {
        return (
            <div className="mx-4 flex justify-center items-center min-h-screen">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-4 flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-500">
                    Error loading post: {error.message}
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-4 flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-500">Post not found</div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Date unavailable';
        const date = new Date(dateString);
        const month = date
            .toLocaleString('default', { month: 'long' })
            .toUpperCase();
        const day = date.getDate();
        const year = date.getFullYear();
        const ordinal = (n) => {
            if (n > 3 && n < 21) return 'TH';
            switch (n % 10) {
                case 1:
                    return 'ST';
                case 2:
                    return 'ND';
                case 3:
                    return 'RD';
                default:
                    return 'TH';
            }
        };
        return `${month} ${day}${ordinal(day)} ${year}`;
    };

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="mx-4 py-4 pr-4 w-full md:w-2/3">
                    {/* Back Button */}
                    <button
                        onClick={handleBackToBlog}
                        className="mb-6 px-2 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition duration-300 hover:cursor-pointer"
                    >
                        ←Back
                    </button>
                    <div className="md:border-r border-gray-400 pr-8 ">
                        {/* Post Image */}
                        <div className="mb-8">
                            <img
                                src={
                                    post.featuredImage?.url ||
                                    '/blog banner.png'
                                }
                                alt={post.featuredImage?.alt || post.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Post Title */}
                        <h1 className="text-4xl tracking-tight font-bold mb-6">
                            {post.title}
                        </h1>
                        {/* Author Info */}
                        <div className="flex items-center mb-8">
                            <img
                                src={
                                    post.author?.profileImage?.url ||
                                    '/default-user-icon.svg'
                                }
                                alt={post.author?.name || 'Author'}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="text-lg font-semibold">
                                    {post.author?.name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {/* Post Content */}
                        <div className="prose prose-lg max-w-none">
                            {post.content && (
                                <div
                                    className="mt-6 text-xl tracking-tight"
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                />
                            )}
                        </div>
                        {/* Additional Features */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">
                                        {post.estimatedReadTime
                                            ? `${post.estimatedReadTime} min read`
                                            : ''}
                                    </span>
                                    <button
                                        onClick={() => likeMutation.mutate()}
                                        disabled={
                                            !isLoggedIn ||
                                            likeMutation.isPending
                                        }
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-sm transition-colors ${
                                            isLiked
                                                ? 'bg-zinc-400/30 text-red-600 hover:bg-red-200'
                                                : 'bg-zinc-400/30 text-gray-600 hover:bg-zinc-200'
                                        } ${
                                            !isLoggedIn
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                        }`}
                                    >
                                        <span>❤️</span>
                                        <span>{likeCount} likes</span>
                                    </button>
                                </div>
                                {/* Share button */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            navigator
                                                .share({
                                                    title: post.title,
                                                    text: post.intro,
                                                    url: window.location.href,
                                                })
                                                .catch(() => {
                                                    // clipboard fallback
                                                    navigator.clipboard.writeText(
                                                        window.location.href
                                                    );
                                                    alert(
                                                        'Link copied to clipboard!'
                                                    );
                                                });
                                        }}
                                        className="px-3 py-1 bg-teal-600 text-white hover:cursor-pointer rounded-sm hover:bg-teal-400 transition-colors"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CommentSection postId={id} />
                </div>
                {/* Sidebar */}
                <div className="w-full md:w-1/3 pt-16 ">
                    <div className="md:hidden mb-8">
                        {/* Mobile: Related posts at bottom */}
                        <h2 className="text-2xl font-bold mb-4">
                            Related Posts
                        </h2>
                        {relatedLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Loading related posts...
                                </p>
                            </div>
                        ) : relatedPosts && relatedPosts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost._id}
                                        to={`/post/${relatedPost._id}`}
                                        className="block"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <img
                                                src={
                                                    relatedPost.featuredImage
                                                        ?.url ||
                                                    '/blog banner.png'
                                                }
                                                alt={
                                                    relatedPost.featuredImage
                                                        ?.alt ||
                                                    relatedPost.title
                                                }
                                                className="w-full h-24 object-cover"
                                            />
                                            <div className="p-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                    {formatDate(
                                                        relatedPost.createdAt
                                                    )}
                                                </p>
                                                <p className="text-sm font-semibold line-clamp-2">
                                                    {relatedPost.title}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No related posts found.
                            </p>
                        )}
                    </div>
                    <div className="hidden md:block">
                        {/* Desktop: Sidebar */}
                        <h2 className="text-2xl font-bold mb-4">
                            Related Posts
                        </h2>
                        {relatedLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Loading related posts...
                                </p>
                            </div>
                        ) : relatedPosts && relatedPosts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {relatedPosts.slice(0, 4).map((relatedPost) => (
                                    <Link
                                        key={relatedPost._id}
                                        to={`/post/${relatedPost._id}`}
                                        className="block"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <img
                                                src={
                                                    relatedPost.featuredImage
                                                        ?.url ||
                                                    '/blog banner.png'
                                                }
                                                alt={
                                                    relatedPost.featuredImage
                                                        ?.alt ||
                                                    relatedPost.title
                                                }
                                                className="w-full h-24 object-cover"
                                            />
                                            <div className="p-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                    {formatDate(
                                                        relatedPost.createdAt
                                                    )}
                                                </p>
                                                <p className="text-sm font-semibold line-clamp-2">
                                                    {relatedPost.title}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No related posts found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
