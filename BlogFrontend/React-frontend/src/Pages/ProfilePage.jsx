import React, { useState, useEffect } from 'react';
import { useAuth } from '../constants/useAuth.js';
import { useParams } from 'react-router-dom';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'react-hot-toast';
import { API_URL } from '../constants/links';

import ProfileCard from '../Components/ProfileCard';

const ProfilePage = () => {
    const { userId } = useParams();
    const { user, setUser, token } = useAuth();
    console.log('ProfilePage user from context:', user);
    const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        role: '',
        isVerified: false,
        profileImage: null,
        profileImagePreview: '',
        bio: '',
    });

    // Fetch profile data from backend
    const {
        data: fetchedProfile,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: async () => {
            const response = await fetch(
                `${API_URL}/api/users/profile/${userId}`
            );

            if (!response.ok) {
                const text = await response.text().catch(() => '');
                console.error('Profile fetch failed', response.status, text);
                throw new Error('Failed to fetch profile data');
            }

            const result = await response.json();

            return result.user || result.data || result;
        },
        enabled: !!userId,
    });

    const {
        data: userPosts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: postsLoading,
    } = useInfiniteQuery({
        queryKey: ['userPosts', userId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                `${API_URL}/api/posts/user/${userId}/posts?page=${pageParam}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }

            return response.json();
        },

        getNextPageParam: (lastPage) => {
            if (
                lastPage.pagination.currentPage < lastPage.pagination.totalPages
            ) {
                return lastPage.pagination.currentPage + 1;
            }

            return undefined;
        },

        enabled: !!userId,
    });

    useEffect(() => {
        const profileData = fetchedProfile || user;
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                username: profileData.username || '',
                email: profileData.email || '',
                role: profileData.role || '',
                isVerified: profileData.isVerified || false,
                profileImage: null,
                profileImagePreview:
                    profileData.profileImage?.url || '/default-user-icon.svg',
                bio: profileData.bio || '',
            });
        }
    }, [fetchedProfile, user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                profileImage: file,
                profileImagePreview: URL.createObjectURL(file),
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const dataToSend = new FormData();
        if (formData.name !== user.name) {
            dataToSend.append('name', formData.name);
        }
        if (formData.username !== user.username) {
            dataToSend.append('username', formData.username);
        }
        if (formData.bio !== user.bio) {
            dataToSend.append('bio', formData.bio);
        }
        if (formData.profileImage) {
            dataToSend.append('profileImage', formData.profileImage);
        }

        updateProfileMutation.mutate(dataToSend);
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (dataToSend) => {
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: dataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 'Failed to update profile'
                );
            }

            return response.json();
        },
        onSuccess: (data) => {
            const updatedUser = data.user;
            if (updatedUser && setUser) {
                setUser(updatedUser);
                // Immediately update the form data state to reflect changes
                setFormData({
                    name: updatedUser.name || '',
                    username: updatedUser.username || '',
                    email: updatedUser.email || '',
                    role: updatedUser.role || '',
                    isVerified: updatedUser.isVerified || false,
                    profileImage: null, // Reset file input
                    profileImagePreview:
                        updatedUser.profileImage?.url ||
                        '/default-user-icon.svg',
                    bio: updatedUser.bio || '',
                });
            }
            queryClient.invalidateQueries({
                queryKey: ['userProfile', userId],
            });
            queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
            setIsModalOpen(false);
            setErrors({});
            toast.success('Profile updated!');
        },
        onError: (error) => {
            console.error('Mutation failed:', error);
            const msg = error.message.toLowerCase();

            if (msg.includes('username')) {
                setErrors({ username: error.message });
            } else {
                alert(error.message); // Fallback for generic errors
            }
        },
    });

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            username: user?.username || '',
            email: user?.email || '',
            role: user?.role || '',
            isVerified: user?.isVerified || false,
            profileImage: null,
            profileImagePreview:
                user?.profileImage?.url || '/default-user-icon.svg',
            bio: user?.bio || '',
        });
        setIsModalOpen(false);

        if (isLoading) {
            return <div>Loading profile...</div>;
        }

        if (isError) {
            return <div>Error loading profile. Please try again later.</div>;
        }
    };

    return (
        <div className="max-h-screen mt-8 px-4">
            <div className="max-w-full mx-auto p-8 relative border-2 border-white rounded-lg shadow-sm ">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-5">
                    Profile
                </h1>
                {user && user._id === userId && (
                    <button
                        className="hover:cursor-pointer absolute top-8 right-8 bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Edit Profile"
                    >
                        Edit
                    </button>
                )}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="shrink-0">
                        <img
                            src={
                                formData.profileImagePreview ||
                                '/default-user-icon.svg'
                            }
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-2 border-teal-200"
                        />
                    </div>
                    <div className="grow pt-4">
                        <div className="flex flex-row space-x-36">
                            <div className="mb-4">
                                <label className="block text-base font-bold text-gray-700">
                                    Name
                                </label>
                                <p className="text-base text-gray-900">
                                    {formData.name || ''}
                                    {console.log('testing:', formData.name)}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-bold text-gray-700">
                                    Username
                                </label>
                                <p className="text-base text-gray-900">
                                    {formData.username || ''}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-bold text-gray-700">
                                    Email
                                </label>
                                <p className="text-base text-gray-900">
                                    {formData.email || ''}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-bold text-gray-700">
                                    Verified
                                </label>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
                                        formData.isVerified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {formData.isVerified
                                        ? 'Verified'
                                        : 'Pending'}
                                </span>
                            </div>
                        </div>
                        <div className="">
                            <label className="block text-base font-bold text-gray-700">
                                Bio
                            </label>
                            <p className="text-base text-gray-900">
                                {formData.bio || ''}
                            </p>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* 1. Backdrop with blur and transition */}
                        <div
                            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
                            onClick={handleCancel} // Close when clicking outside
                        ></div>

                        {/* 2. Modal Panel */}
                        <div className="relative w-full max-w-lg transform rounded-xl bg-white shadow-2xl transition-all flex flex-col max-h-[90vh]">
                            {/* HEADER */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Edit Profile
                                </h2>
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                                >
                                    {/* X Icon */}
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* BODY (Scrollable if content gets too long) */}
                            <div className="px-6 py-6 overflow-y-auto">
                                <form
                                    id="edit-profile-form"
                                    onSubmit={handleSave}
                                    className="space-y-6"
                                >
                                    {/* Editable Fields Grouped */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                                                htmlFor="name"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                                                htmlFor="username"
                                            >
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900  focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                required
                                            />
                                            {errors.username && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                                    <span className="mr-1">
                                                        ⚠️
                                                    </span>{' '}
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                                            htmlFor="bio"
                                        >
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900  focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <div className="rounded-lg bg-gray-100 p-4 border border-gray-100">
                                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 tracking-wider">
                                                Email
                                            </label>
                                            <div className="text-sm font-medium text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded">
                                                {formData.email}
                                            </div>
                                        </div>

                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <span className="mr-1">⚠️</span>{' '}
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* 3. Styled File Input */}
                                    <div>
                                        <label
                                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                                            htmlFor="profileImage"
                                        >
                                            Profile Image
                                        </label>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition"
                                        />
                                    </div>

                                    {/* 4. Read-Only Info Section */}
                                    <div className="rounded-lg bg-gray-100 p-4 border border-gray-100">
                                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                            Account Status
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    Role
                                                </label>
                                                <div className="text-sm font-medium text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded">
                                                    {formData.role}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    Verification
                                                </label>
                                                <div className="flex items-center h-[38px] px-3 bg-white border border-gray-200 rounded">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            formData.isVerified
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {formData.isVerified
                                                            ? 'Verified'
                                                            : 'Unverified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* FOOTER */}
                            <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="hover:cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSave}
                                    // Disable button while loading
                                    disabled={updateProfileMutation.isPending}
                                    className={`hover:cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 
                                    ${
                                        updateProfileMutation.isPending
                                            ? 'bg-teal-400 cursor-not-allowed'
                                            : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                                >
                                    {updateProfileMutation.isPending
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="max-w-full mx-auto p-8 px-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Posts
                </h2>
                {postsLoading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userPosts?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.data.map((post) => (
                                    <ProfileCard key={post._id} blog={post} />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {hasNextPage && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
