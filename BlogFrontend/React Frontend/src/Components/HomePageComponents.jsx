import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogCardsA } from './BlogCards.jsx';
import { useAuth } from '../constants/AuthContext.jsx';

export const HeroSection = () => {
    return (
        <div>
            <div className="container-2 flex flex-row max-md:flex-col 100vh px-12 py-12 max-md:py-4 max-md:px-2 justify-between items-center max-md:mb-12">
                <div className="hero text mr-8 max-md:w-full max-md:m-2 max-md:text-center">
                    <h1 className="text-5xl font-medium mb-4 max-md:text-4xl tracking-tighter">
                        Unearth a New Story Every Day.
                    </h1>
                    <p className="mb-8 text-lg">
                        From forgotten facts to future trends, we dig deep to
                        bring you the stories you won't find anywhere else.
                    </p>
                    <Link to="/blog">
                        <button className="bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-500 hover:cursor-pointer w-32 h-12 max-md:h-auto max-md:py-4 max-md:px-10 max-md:w-1/2">
                            Go To Blog
                        </button>
                    </Link>
                </div>
                <div className="hero image ml-8 max-md:w-full max-md:m-2 max-md:order-first">
                    <img
                        src="/blog banner.png"
                        alt="Hero Image"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export const HomePageCard = () => {
    return (
        <div className="card bg-base-100 w-full max-md:w-auto hover:shadow-lg rounded-lg max-md:my-4 max-md:shadow-lg">
            <figure className="overflow-hidden rounded-lg w-full h-64 max-md:h-48">
                <img
                    src="/blog banner.png"
                    className="rounded-lg w-full h-full object-cover 
                    transform transition-transform duration-500 ease-in-out
                    hover:scale-125"
                    alt="Shoes"
                />
            </figure>
            <div className="card-body p-4 max-md:h-auto max-md:px-2">
                <h2 className="card-title mt-2 max-sm:mt-0 max-md:px-0 max-md:font-bold font-bold">
                    Card Title
                </h2>
                <p className="my-2 max-md:tracking-tighter max-md:my-0">
                    A card component has a figure, a body part, and inside body
                    there are title and actions parts
                </p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary bg-teal-800 p-2 rounded-lg text-white hover:bg-teal-500 max-md:hidden">
                        Read Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HomePageCardsSection = () => {
    const queryClient = useQueryClient();
    const {
        data: posts,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const result = await response.json();
            return result.data;
        },
    });

    useEffect(() => {
        queryClient.invalidateQueries('posts');
    }, []);

    if (isLoading) {
        return (
            <div className="container-3 flex flex-col items-center px-12 max-md:px-4 my-8 max-md:my-4">
                <p className="text-4xl font-medium tracking-tighter text-center underline underline-offset-8 decoration-teal-500 max-md:underline-offset-4 decoration-2 max-md:text-3xl">
                    Featured Stories
                </p>
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-3 flex flex-col items-center px-12 max-md:px-4 my-8 max-md:my-4">
                <p className="text-4xl font-medium tracking-tighter text-center underline underline-offset-8 decoration-teal-500 max-md:underline-offset-4 decoration-2 max-md:text-3xl">
                    Featured Stories
                </p>
                <p className="text-red-500 text-center">
                    Error loading stories: {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="container-3 flex flex-col items-center px-12 max-md:px-4 my-8 max-md:my-4">
            <p className="text-4xl font-medium tracking-tighter text-center underline underline-offset-8 decoration-teal-500 max-md:underline-offset-4 decoration-2 max-md:text-3xl">
                Featured Stories
            </p>
            <div className="w-full my-8 max-md:my-4">
                <BlogCardsA posts={posts?.slice(0, 9)} />
            </div>
        </div>
    );
};

export const Mission = () => {
    return (
        <div className="container-4 mt-16 max-md:mt-2 max-md:px-4">
            <div className="mission">
                <p className="text-4xl font-medium text-center max-md:text-2xl  decoration-teal-500 decoration-2 underline underline-offset-8">
                    Our Mission
                </p>
                <p className="text-lg text-center mx-24 my-8 max-md:mx-2 max-md:my-4 max-md:tracking-tight max-md:text-left">
                    At The Daily Dig, we believe that every day holds a new
                    discovery. In a world full of noise, we're here to do the
                    hard work of digging through the surface to unearth the
                    stories you won't find anywhere else. From forgotten history
                    and scientific breakthroughs to fascinating cultural quirks
                    and emerging trends, our mission is to deliver a fresh dose
                    of insight and inspiration with every post. This blog is a
                    home for the curious, the explorers, and the lifelong
                    learners. It's a place where we celebrate the joy of finding
                    something new and share it with a community that's just as
                    excited to learn. So, welcome to the dig. Get ready to
                    explore.
                </p>
            </div>
        </div>
    );
};

export const AddStory = () => {
    const fileInputRef = useRef(null);

    // 1. Update State to include image data
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        selectedTags: [],
        coverImage: null, // The actual file object
        coverImagePreview: '', // The URL for display
    });

    const [publishError, setPublishError] = useState('');
    const [publishSuccess, setPublishSuccess] = useState('');
    const navigate = useNavigate();

    const publishMutation = useMutation({
        // 1. Move the async function to the 'mutationFn' property
        mutationFn: async (data) => {
            // Make sure this matches what you saved in AuthCallback ('authToken' or 'token')
            const token = localStorage.getItem('token');

            const payload = new FormData();
            payload.append('title', data.title);
            payload.append('content', data.content);
            payload.append('tags', JSON.stringify(data.selectedTags || []));
            if (data.coverImage) payload.append('coverImage', data.coverImage);

            const res = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: payload,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(
                    err.message || `Publish failed (${res.status})`
                );
            }
            return res.json();
        },
        // 2. Keep onSuccess and onError in the same object
        onSuccess: (result) => {
            setPublishSuccess('Story published successfully.');
            setPublishError('');
            const newId = result?.data?._id || result?.post?._id || result?.id;
            if (newId) navigate(`/post/${newId}`);
        },
        onError: (err) => {
            setPublishError(err.message || 'Failed to publish story');
            setPublishSuccess('');
        },
    });

    const AVAILABLE_TAGS = [
        'Technology',
        'Health',
        'Business',
        'Science',
        'Education',
        'Sports',
        'Lifestyle',
        'Politics',
        'Entertainment',
    ];

    // --- Handlers ---

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleTag = (tag) => {
        setFormData((prev) => {
            if (prev.selectedTags.includes(tag)) {
                return {
                    ...prev,
                    selectedTags: prev.selectedTags.filter((t) => t !== tag),
                };
            } else {
                return { ...prev, selectedTags: [...prev.selectedTags, tag] };
            }
        });
    };

    // 2. Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a fake URL for immediate preview
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                coverImage: file,
                coverImagePreview: previewUrl,
            }));
        }
    };

    // 3. Handle Image Removal
    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            coverImage: null,
            coverImagePreview: '',
        }));
        // Reset file input so selecting the same file works again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handlePublish = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setPublishError('');
        setPublishSuccess('');
        if (!formData.title || !formData.content) {
            setPublishError('Title and content are required.');
            return;
        }
        publishMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 sm:p-12">
                    <div className="mb-10 border-b border-gray-100 pb-6">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Write a New Story
                        </h1>
                    </div>

                    {/* --- 4. New Cover Image Section --- */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Cover Image (Optional)
                        </label>

                        {/* Hidden Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {formData.coverImagePreview ? (
                            // PREVIEW STATE
                            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden group">
                                <img
                                    src={formData.coverImagePreview}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay with Remove Button */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={removeImage}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition shadow-lg flex items-center gap-2 hover:cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-1 1-1h6c1 0 1 1 1 1v2" />
                                        </svg>
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // UPLOAD STATE
                            <div
                                onClick={triggerFileInput}
                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-teal-500 hover:text-teal-600 hover:bg-gray-50 transition-all duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mb-2"
                                >
                                    <rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="3"
                                        rx="2"
                                        ry="2"
                                    />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                                <span className="text-sm font-medium">
                                    Click to add a cover image
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="mb-8">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your story a title..."
                            className="block w-full text-4xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 focus:outline-none px-0 py-3 bg-transparent leading-normal h-auto"
                        />
                    </div>

                    {/* Tag Selection */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const isSelected =
                                    formData.selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:cursor-pointer
                                            ${
                                                isSelected
                                                    ? 'bg-teal-600 text-white shadow-md transform scale-105'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Textarea */}
                    <div className="mb-8">
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Tell your story..."
                            className="w-full h-96 p-4 text-lg text-gray-800 bg-gray-100 rounded-lg border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 resize-y transition-colors duration-200 leading-relaxed"
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <button className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={publishMutation.isLoading}
                            className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                            {publishMutation.isLoading
                                ? 'Publishing...'
                                : 'Publish Story'}
                        </button>
                    </div>
                    {publishError && (
                        <p className="text-red-500 mt-3">{publishError}</p>
                    )}
                    {publishSuccess && (
                        <p className="text-green-500 mt-3">{publishSuccess}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HomePageLayout = () => {
    return (
        <>
            <HeroSection />
            <HomePageCardsSection />
            <Mission />
        </>
    );
};

export const SignupLayout = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const signupMutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch(
                'http://localhost:3000/api/auth/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setSuccess(
                'Account created successfully! Redirecting to email verification...'
            );
            setError('');
            // Navigate to the verification page with email and type
            setTimeout(() => {
                navigate(`/verify-otp?email=${formData.email}&type=verify`);
            }, 2000);
        },
        onError: (error) => {
            setError(error.message);
            setSuccess('');
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        signupMutation.mutate(formData);
    };

    const handleGoogleSignUp = () => {
        console.log('handleGoogleSignUp clicked');
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    return (
        // 1. Main Container: Centered, with padding for mobile safety
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2 w-full">
            {/* 2. Content Wrapper: Limits width on desktop (max-w-md), full width on mobile */}
            <div className=" w-full max-w-lg flex flex-col items-center backdrop-blur-sm px-16 space-y-2 rounded-2xl  ">
                <img
                    src="/blog_logo-removebg-preview.png"
                    alt="Sample Image"
                    className="w-24"
                />

                <div className="border-b pb-2 flex-col space-y-2">
                    <p className="tracking-tighter text-4xl font-medium text-center decoration-teal-500 decoration-2 max-md:text-2xl">
                        Join us at The Daily Dig
                    </p>
                    <p className="tracking-tighter text-xl font-base text-center decoration-teal-500 decoration-2 max-md:text-2xl">
                        Create your Account
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex flex-row gap-4 w-full justify-center">
                    {/* Google SVG */}
                    <div className="flex flex-row gap-4 mt-2 w-full justify-center">
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="flex items-center justify-center w-auto px-4 py-2 h-12 rounded-lg hover:cursor-pointer hover:bg-zinc-300 border border-zinc-100 shadow-sm transition"
                        >
                            <p className="text-base font-medium mr-2 tracking-tighter">
                                Continue with Google
                            </p>
                            {/* Google Logo */}
                            <svg className="w-6 h-6" viewBox="0 0 48 48">
                                <path
                                    fill="#4285F4"
                                    d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.6 2.1 30.2 0 24 0 14.6 0 6.4 5.5 2.5 13.5l7.9 6.1C12.5 13 17.8 9.5 24 9.5z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.8-2 5.2-4.3 6.8l7.9 6.1c4.6-4.2 7.3-10.3 7.3-17.4z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.4 28.1c-.5-1.3-.8-2.7-.8-4.1s.3-2.8.8-4.1l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.2l7.9-6.1z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5.1 2.4-8.1 2.4-6.2 0-11.5-4.2-13.6-9.9l-7.9 6.1C6.4 42.5 14.6 48 24 48z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="text-center font-medium">Or</div>

                {/* Form: w-full ensures it takes the width of the parent (max-w-md) */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    {/* Input Group 1 */}
                    <label className="font-medium text-left " htmlFor="name">
                        Username
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white w-full h-10 rounded-lg px-4 shadow-lg mb-6 border border-gray-100"
                    />

                    {/* Input Group 2 */}
                    <label className="font-medium text-left " htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white w-full h-10 rounded-lg px-4 shadow-lg mb-6 border border-gray-100"
                    />

                    {/* Input Group 3 */}
                    <label
                        className="font-medium text-left "
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="********"
                        className="bg-white w-full h-10 rounded-lg px-4 shadow-lg mb-6 border border-gray-100"
                    />

                    {/* Error/Success Messages */}
                    {error && (
                        <p className="text-red-500 text-base italic mb-2">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-green-500 text-base italic mb-2">
                            {success}
                        </p>
                    )}

                    {/* Submit Button: w-full to fill container */}
                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="bg-teal-800 text-white px-4 py-2 w-full rounded-lg hover:bg-teal-500 font-bold disabled:opacity-50 transition duration-300 mb-4"
                    >
                        {signupMutation.isPending
                            ? 'Creating Account...'
                            : 'Create Account'}
                    </button>

                    {/* Login Link */}
                    <div className="text-center w-full">
                        <p>
                            Have an Account?
                            <Link
                                to="/login"
                                className="inline-block align-baseline font-medium text-sm text-teal-500 hover:text-teal-800 ml-1"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ResetPasswordLayout = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (email) => {
            const response = await fetch(
                'http://localhost:3000/api/auth/send-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send OTP');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setSuccess(data.message);
            setError('');
            // Navigate to OTP page for password reset
            setTimeout(() => {
                navigate(`/verify-otp?email=${email}&type=reset`);
            }, 2000);
        },
        onError: (error) => {
            setError(error.message);
            setSuccess('');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        setError('');
        setSuccess('');
        mutation.mutate(email);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 w-full ">
            <div className="w-full max-w-md flex flex-col items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-zinc-100">
                <img
                    src="/blog_logo-removebg-preview.png"
                    alt="Logo"
                    className="w-24 mb-4"
                />
                <p className="text-4xl font-medium text-center decoration-teal-500 decoration-2 max-md:text-2xl tracking-tighter ">
                    Reset Password
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col mt-4"
                >
                    <label
                        className="font-medium text-left my-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white w-full h-12 px-4 rounded-lg shadow-lg mb-4"
                        placeholder="Enter your email"
                    />
                    {error && (
                        <p className="text-red-500 text-center mb-2">{error}</p>
                    )}
                    {success && (
                        <p className="text-green-500 text-center mb-2">
                            {success}
                        </p>
                    )}
                    <button
                        className="bg-teal-800 text-white px-4 py-2 w-full rounded-lg hover:bg-teal-500 font-bold disabled:opacity-50"
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
                <div className="w-full mt-4">
                    <div className="text-center w-full mb-4">
                        <p className="">
                            Remember your password?
                            <Link
                                to="/login"
                                className="inline-block align-baseline font-medium text-sm text-teal-500 hover:text-teal-800"
                            >
                                Log in
                            </Link>
                        </p>
                        <p className="">
                            Don't have an account?
                            <Link
                                to="/signup"
                                className="inline-block align-baseline font-medium text-sm text-teal-500 hover:text-teal-800"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const VerifyOTPLayout = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const email = queryParams.get('email');
    const type = queryParams.get('type'); // 'reset' or 'verify'
    const isResetFlow = type === 'reset';

    const verifyEmailMutation = useMutation({
        mutationFn: (data) =>
            fetch('http://localhost:3000/api/auth/verify-email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then((res) =>
                res.ok
                    ? res.json()
                    : res.json().then((err) => {
                          throw new Error(err.message);
                      })
            ),
        onSuccess: (data) => {
            setSuccess(data.message + ' Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 3000);
        },
        onError: (error) => setError(error.message),
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ email, otp, newPassword }) => {
            // Step 1: Verify OTP to get tempToken
            const verifyRes = await fetch(
                'http://localhost:3000/api/auth/verify-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp }),
                }
            );
            if (!verifyRes.ok)
                throw new Error(
                    (await verifyRes.json()).message || 'Invalid OTP'
                );
            const { tempToken } = await verifyRes.json();

            // Step 2: Reset password with tempToken
            const resetRes = await fetch(
                'http://localhost:3000/api/auth/reset-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tempToken}`,
                    },
                    body: JSON.stringify({ newPassword }),
                }
            );
            if (!resetRes.ok)
                throw new Error(
                    (await resetRes.json()).message ||
                        'Failed to reset password'
                );
            return resetRes.json();
        },
        onSuccess: (data) => {
            setSuccess(data.message + ' Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 3000);
        },
        onError: (error) => setError(error.message),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (isResetFlow) {
            if (!newPassword) return setError('New password is required.');
            resetPasswordMutation.mutate({ email, otp, newPassword });
        } else {
            verifyEmailMutation.mutate({ email, otp });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 w-full">
            <div className="w-full max-w-md flex flex-col items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-zinc-100">
                <p className="text-4xl font-medium text-center decoration-teal-500 decoration-2 max-md:text-2xl tracking-tighter mb-4">
                    {isResetFlow ? 'Set New Password' : 'Verify Your Email'}
                </p>
                <p className="text-center text-gray-600 mb-4">
                    An OTP has been sent to <strong>{email}</strong>.
                </p>
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <label className="font-medium text-left my-2" htmlFor="otp">
                        Enter OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="bg-white w-full h-12 px-4 rounded-lg shadow-lg mb-4"
                        placeholder="6-digit code"
                    />
                    {isResetFlow && (
                        <>
                            <label
                                className="font-medium text-left my-2"
                                htmlFor="password"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="bg-white w-full h-12 px-4 rounded-lg shadow-lg mb-4"
                                placeholder="Enter new password"
                            />
                        </>
                    )}
                    {error && (
                        <p className="text-red-500 text-center mb-2">{error}</p>
                    )}
                    {success && (
                        <p className="text-green-500 text-center mb-2">
                            {success}
                        </p>
                    )}
                    <button
                        className="bg-teal-800 text-white px-4 py-2 w-full rounded-lg hover:bg-teal-500 font-bold disabled:opacity-50"
                        type="submit"
                        disabled={
                            verifyEmailMutation.isPending ||
                            resetPasswordMutation.isPending
                        }
                    >
                        {verifyEmailMutation.isPending ||
                        resetPasswordMutation.isPending
                            ? 'Verifying...'
                            : 'Verify & Proceed'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const LoginLayout = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch(
                'http://localhost:3000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            return response.json();
        },
        onSuccess: (data) => {
            console.log('SERVER RESPONSE:', data);
            // ensure server returned token and user
            if (!data?.token || !data?.user) return;
            login(data.token, data.user);
            if (data.user.role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/blog', { replace: true });
            }
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        loginMutation.mutate(formData);
    };

    // Auto hide the error message after 5 seconds
    useEffect(() => {
        if (loginMutation.isError) {
            const timer = setTimeout(() => {
                loginMutation.reset();
                setError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [loginMutation.isError]);

    const handleGoogleSignIn = () => {
        console.log('handleGoogleSignIn clicked');
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    return (
        // 1. Main Container: Full width, centered content, safe padding for mobile
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            {/* 2. Constraint Wrapper: Prevents content getting too wide on desktop (max-w-md) */}
            <div className=" w-full max-w-lg flex flex-col items-center backdrop-blur-sm px-8 py-4 rounded-2xl">
                <img
                    src="/blog_logo-removebg-preview.png"
                    alt="Sample Image"
                    className="w-24 mb-4"
                />

                <div className=" border-b pb-0.5">
                    <p className="text-4xl font-medium text-center decoration-teal-500 decoration-2 max-md:text-2xl tracking-tighter mb-2">
                        Welcome to The Daily Dig
                    </p>
                    <p className="text-xl font-base text-center decoration-teal-500 decoration-2 max-md:text-xl tracking-tighter mb-2">
                        Log in to your account
                    </p>
                </div>

                {/* Social Icons: Removed fixed width, used gap for spacing */}
                <div className="flex flex-row gap-4 mt-6 w-full justify-center">
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center w-auto px-4 py-2 h-12 rounded-lg hover:cursor-pointer hover:bg-zinc-300 border border-zinc-100 shadow-sm transition"
                    >
                        <p className="text-base font-medium mr-2 tracking-tighter">
                            Continue with Google
                        </p>
                        {/* Google Logo */}
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                            <path
                                fill="#4285F4"
                                d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.6 2.1 30.2 0 24 0 14.6 0 6.4 5.5 2.5 13.5l7.9 6.1C12.5 13 17.8 9.5 24 9.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.8-2 5.2-4.3 6.8l7.9 6.1c4.6-4.2 7.3-10.3 7.3-17.4z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.4 28.1c-.5-1.3-.8-2.7-.8-4.1s.3-2.8.8-4.1l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.2l7.9-6.1z"
                            />
                            <path
                                fill="#EA4335"
                                d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5.1 2.4-8.1 2.4-6.2 0-11.5-4.2-13.6-9.9l-7.9 6.1C6.4 42.5 14.6 48 24 48z"
                            />
                        </svg>
                    </button>
                </div>

                <div className="text-center font-medium my-2">Or</div>

                {/* 3. Form: Removed px-24, set width to full */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <label
                        className="font-medium text-left mb-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    {/* Input: Changed w-96 to w-full */}
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white w-full h-10 px-4 rounded-lg shadow-lg mb-4 border border-gray-100"
                    />

                    <label
                        className="font-medium text-left mb-1"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    {/* Input: Changed w-96 to w-full */}
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-white w-full h-10 rounded-lg px-4 shadow-lg mb-6 border border-gray-100"
                        required
                        placeholder="********"
                    />

                    {error && (
                        <p className="text-red-500 text-base italic text-center">
                            {error}
                        </p>
                    )}

                    {/* Button: Changed w-96 to w-full */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="bg-teal-800 text-white px-4 py-2 w-full rounded-lg hover:bg-teal-500 font-bold disabled:opacity-50 mb-6"
                    >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Removed <br> tags, used flex col + margin */}
                    <div className="text-center w-full flex flex-col gap-2">
                        <p>
                            Forgot your password?
                            <Link
                                to="/reset-password"
                                className="inline-block align-baseline font-medium text-sm text-teal-500 hover:text-teal-800 ml-1"
                            >
                                Reset it
                            </Link>
                        </p>
                        <p>
                            Don't have an account?
                            <Link
                                to="/signup"
                                className="inline-block align-baseline font-medium text-sm text-teal-500 hover:text-teal-800 ml-1"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
