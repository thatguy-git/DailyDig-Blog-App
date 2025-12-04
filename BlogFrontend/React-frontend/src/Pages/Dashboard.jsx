import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from '../Components/Searchbar.jsx';
import Navbar from '../Components/Navbar.jsx';
import { API_URL } from '../constants/links';
import { useAuth } from '../constants/useAuth.js';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ArrowUp,
    Clock,
    BookOpen,
    TrendingUp,
    Share2,
    Filter,
    PlusCircle,
    Trash2,
    Edit,
    User,
    Shield,
    Bell,
    Star,
} from 'lucide-react';

//Demo Data for charts
const chartData = [
    { name: 'Jan', 'Page Views': 35000, Comments: 180, Shares: 1500 },
    { name: 'Feb', 'Page Views': 32000, Comments: 160, Shares: 1400 },
    { name: 'Mar', 'Page Views': 45000, Comments: 250, Shares: 2200 },
    { name: 'Apr', 'Page Views': 42000, Comments: 210, Shares: 1900 },
    { name: 'May', 'Page Views': 55000, Comments: 300, Shares: 2800 },
    { name: 'Jun', 'Page Views': 58000, Comments: 320, Shares: 3100 },
];

//Demo Data for charts
const topPosts = [
    {
        rank: 1,
        title: 'The Future of AI in Modern Web Development',
        views: '15.4k',
        shares: '3.2k',
        comments: '452',
    },
    {
        rank: 2,
        title: 'Understanding React Hooks: A Complete Guide',
        views: '12.1k',
        shares: '1.8k',
        comments: '230',
    },
    {
        rank: 3,
        title: 'Why I Switched from SQL to MongoDB',
        views: '9.8k',
        shares: '2.1k',
        comments: '890',
    },
    {
        rank: 4,
        title: '10 CSS Tricks You Need to Know in 2025',
        views: '8.5k',
        shares: '950',
        comments: '120',
    },
    {
        rank: 5,
        title: 'Deploying Node.js Apps to Render and Vercel',
        views: '6.2k',
        shares: '400',
        comments: '85',
    },
];

//Demo Data for charts
const stats = [
    {
        title: 'Total Page Views',
        value: '58K',
        change: '+15%',
        icon: TrendingUp,
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
    },
    {
        title: 'New Subscribers',
        value: '840',
        change: '+5.1%',
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Avg. Time on Page',
        value: '3:45 min',
        change: '-2.4%',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
    {
        title: 'Total Shares',
        value: '18.5K',
        change: '+22%',
        icon: Share2,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
    },
];

const getRoleBadgeClasses = (role) => {
    switch (role) {
        case 'admin':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'user':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Administrator':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'Editor':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Author':
            return 'bg-teal-100 text-teal-800 border-teal-300';
        case 'demo_admin':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Subscriber':
            return 'bg-gray-100 text-gray-800 border-gray-300';
        default:
            return 'bg-gray-200 text-gray-700';
    }
};

const navItems = [
    { name: 'User Management', icon: User, view: 'UserManagement' },
    { name: 'Content Management', icon: BookOpen, view: 'ContentManagement' },
    { name: 'Analytics', icon: BarChart3, view: 'Analytics' },
    {
        name: 'Security & Maintenance',
        icon: Shield,
        view: 'SecurityMaintenance',
    },
    { name: 'Notifications & Alerts', icon: Bell, view: 'NotificationsAlerts' },
];

// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
    const isPositive = change.startsWith('+');

    return (
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColor} ${color} mb-3`}
            >
                <Icon size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500 truncate">
                {title}
            </p>
            <div className="flex items-baseline mt-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <span
                    className={`ml-2 text-sm font-semibold flex items-center ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    <ArrowUp
                        size={14}
                        className={`inline ${isPositive ? '' : 'rotate-180'}`}
                    />
                    {change}
                </span>
            </div>
        </div>
    );
};

const Sidebar = ({
    isOpen,
    toggleSidebar,
    currentView,
    setCurrentView,
    logout,
}) => {
    const handleNavigation = (view) => {
        setCurrentView(view);
        if (isOpen) {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Overlay for mobile view when sidebar is open */}
            <div
                className={`fixed inset-0 bg-gray-900/50 z-30 transition-opacity ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar Content */}
            <nav
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 h-16 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold tracking-wider text-teal-400">
                        Daily Dig
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-white hover:text-teal-300 transition p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col justify-between h-[calc(100%-4rem)] p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => handleNavigation(item.view)}
                                    className={`flex items-center w-full p-3 rounded-xl transition duration-200 ${
                                        item.view === currentView
                                            ? 'bg-teal-600 text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={20} className="mr-3" />
                                    <span className="font-medium whitespace-nowrap">
                                        {item.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-700">
                        <button
                            onClick={logout}
                            className="flex items-center w-full p-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

const DashboardHeader = ({ toggleSidebar, user }) => (
    <header className="fixed top-0 left-4 right-4 h-20 bg-zinc-100/30 backdrop-blur-sm z-40 shadow-lg rounded-b-md ">
        <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-gray-900 p-2 rounded-lg transition hover:cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold text-teal-700">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                {/* User profile image */}
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl font-semibold">
                    {user?.profileImage?.url ? (
                        <img
                            src={user.profileImage.url}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || 'A'
                    )}
                </div>
            </div>
        </div>
    </header>
);

const AnalyticsPage = () => (
    <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg px-4 py-2">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tighter">
                Traffic & Engagement Analytics
            </h2>
            <select className="p-2 border-2 bg-teal-500 text-white rounded-lg  focus:ring-white focus:border-white transition duration-150 text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
            </select>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
            ))}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Monthly Traffic & Engagement Trend
            </h2>
            <div className="h-80 w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    style={{ outline: 'none' }}
                >
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        onClick={() => {}}
                        style={{ outline: 'none' }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        {/* YAxis for Page Views (left) - Primary Metric */}
                        <YAxis
                            yAxisId="left"
                            stroke="#0d9488"
                            label={{
                                value: 'Views',
                                angle: -90,
                                position: 'left',
                                fill: '#0d9488',
                            }}
                        />
                        {/* YAxis for Comments (right) - Secondary Metric */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#3b82f6"
                            label={{
                                value: 'Comments',
                                angle: 90,
                                position: 'right',
                                fill: '#3b82f6',
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            labelStyle={{
                                fontWeight: 'bold',
                                color: '#1f2937',
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '16px' }} />
                        {/* Page Views line (using left Y-axis) */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Page Views"
                            stroke="#0d9488"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                        {/* Comments line (using right Y-axis) */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="Comments"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top Performing Posts (Last 30 Days)
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Post Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shares
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comments
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {topPosts.map((post) => (
                            <tr
                                key={post.rank}
                                className="hover:bg-gray-50 transition duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {post.rank}
                                </td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 hover:text-blue-800 cursor-pointer">
                                    {post.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.views}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.shares}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.comments}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ContentManagementPage = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [newPostData, setNewPostData] = useState({
        title: '',
        content: '',
        tags: '',
        coverImage: null,
    });

    const { data: postsData, isPending: postsLoading } = useQuery({
        queryKey: ['adminPosts', searchQuery],
        queryFn: async () => {
            const url = `${API_URL}/api/admin/posts${
                searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''
            }`;

            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(url, {
                headers,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch posts');
            }

            return response.json();
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/posts/${postId}`,
                {
                    method: 'DELETE',
                    headers,
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete post');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            toast.success('Post deleted successfully!');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error deleting post');
            }
        },
    });

    const createPostMutation = useMutation({
        mutationFn: async (postData) => {
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('content', postData.content);
            formData.append('tags', postData.tags);
            if (postData.coverImage) {
                formData.append('coverImage', postData.coverImage);
            }

            const headers = {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                headers,
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            toast.success('Post created successfully!');
            setShowCreatePostModal(false);
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error creating post');
            }
        },
    });

    const toggleEditorPickMutation = useMutation({
        mutationFn: async (postId) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/posts/${postId}/toggle-editor-pick`,
                {
                    method: 'PUT',
                    headers,
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to toggle Editor's Pick status"
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            toast.success("Editor's Pick status toggled.");
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(
                    error.message || "Error toggling Editor's Pick status"
                );
            }
        },
    });

    const handleDeletePost = (postId, postTitle) => {
        if (
            window.confirm(
                `Are you sure you want to delete post: "${postTitle}"?`
            )
        ) {
            deletePostMutation.mutate(postId);
        }
    };

    const handleCreatePost = () => {
        setNewPostData({
            title: '',
            content: '',
            tags: '',
            coverImage: null,
        });
        setShowCreatePostModal(true);
    };

    const handleCreatePostSubmit = (e) => {
        e.preventDefault();
        createPostMutation.mutate(newPostData);
    };

    const posts = postsData?.posts || [];
    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;
        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.author?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const updatePostMutation = useMutation({
        mutationFn: async ({ postId, ...updateData }) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/posts/${postId}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(updateData),
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            toast.success('Post updated successfully!');
            setShowEditPostModal(false);
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error updating post');
            }
        },
    });

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowEditPostModal(true);
    };

    const handleUpdatePostSubmit = (e) => {
        e.preventDefault();
        if (!editingPost) return;

        // Ensure tags are in the correct format (array of strings)
        const tags =
            typeof editingPost.tags === 'string'
                ? editingPost.tags.split(',').map((tag) => tag.trim())
                : editingPost.tags;

        updatePostMutation.mutate({
            postId: editingPost._id,
            title: editingPost.title,
            content: editingPost.content,
            tags: tags,
        });
    };

    return (
        <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Content Management: All Posts
                </h2>
                <button
                    onClick={handleCreatePost}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add New Post
                </button>
            </div>

            <div className="mb-6">
                <Searchbar onSearch={setSearchQuery} />
            </div>

            {postsLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading posts...</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Likes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPosts.map((post) => (
                                <tr
                                    key={post._id}
                                    className="hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.author?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                post.published
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {post.published
                                                ? 'Published'
                                                : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.likeCount || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() =>
                                                toggleEditorPickMutation.mutate(
                                                    post._id
                                                )
                                            }
                                            className={`p-1 rounded-full transition hover:cursor-pointer ${
                                                post.isEditorPick
                                                    ? 'text-yellow-400 hover:text-yellow-500'
                                                    : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                        >
                                            <Star
                                                size={16}
                                                fill={
                                                    post.isEditorPick
                                                        ? 'currentColor'
                                                        : 'none'
                                                }
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition hover:cursor-pointer"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeletePost(
                                                    post._id,
                                                    post.title
                                                )
                                            }
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition hover:cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreatePostModal && (
                <div className="fixed inset-0 bg-zinc-200/30 backdrop-blur-lg bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-15 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white border-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Create New Post
                            </h3>
                            <form
                                onSubmit={handleCreatePostSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newPostData.title}
                                        onChange={(e) =>
                                            setNewPostData({
                                                ...newPostData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        value={newPostData.content}
                                        onChange={(e) =>
                                            setNewPostData({
                                                ...newPostData,
                                                content: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newPostData.tags}
                                        onChange={(e) =>
                                            setNewPostData({
                                                ...newPostData,
                                                tags: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cover Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setNewPostData({
                                                ...newPostData,
                                                coverImage: e.target.files[0],
                                            })
                                        }
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCreatePostModal(false)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Create Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showEditPostModal && (
                <div className="fixed inset-0 bg-zinc-200/30 backdrop-blur-lg bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-15 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white border-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Edit Post
                            </h3>
                            <form
                                onSubmit={handleUpdatePostSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editingPost?.title || ''}
                                        onChange={(e) =>
                                            setEditingPost({
                                                ...editingPost,
                                                title: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        value={editingPost?.content || ''}
                                        onChange={(e) =>
                                            setEditingPost({
                                                ...editingPost,
                                                content: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingPost?.tags || ''}
                                        onChange={(e) =>
                                            setEditingPost({
                                                ...editingPost,
                                                tags: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEditPostModal(false)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Update Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserManagementPage = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users, isPending: usersLoading } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            const isSearch = searchQuery.trim() !== '';
            const url = isSearch
                ? `${API_URL}/api/users/search?q=${encodeURIComponent(
                      searchQuery
                  )}`
                : `${API_URL}/api/admin/users`;

            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(url, {
                headers,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || `Failed to fetch users from ${url}`
                );
            }

            const data = await response.json();
            // The search endpoint returns { data: [...] } while the admin endpoint returns { users: [...] }
            if (isSearch) {
                return data.data;
            }
            return data.users;
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/users/${userId}`,
                {
                    method: 'DELETE',
                    headers,
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully!');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error deleting user');
            }
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ userId, updates }) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/users/${userId}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(updates),
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully!');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error updating user');
            }
        },
    });

    const createUserMutation = useMutation({
        mutationFn: async (userData) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(`${API_URL}/api/admin/users`, {
                method: 'POST',
                headers,
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully!');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error creating user');
            }
        },
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
        isVerified: false,
    });

    const handleCreateUser = () => {
        setFormData({
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'user',
            isVerified: false,
        });
        setShowCreateModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '', // Don't prefill password
            role: user.role,
            isVerified: user.isVerified,
        });
        setShowEditModal(true);
    };

    const handleDeleteUser = (userId, userName) => {
        if (
            window.confirm(`Are you sure you want to delete user: ${userName}?`)
        ) {
            deleteUserMutation.mutate(userId);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (showCreateModal) {
            createUserMutation.mutate(formData);
            setShowCreateModal(false);
        } else if (showEditModal && selectedUser) {
            const updates = { ...formData };
            if (!updates.password) delete updates.password;
            updateUserMutation.mutate({ userId: selectedUser._id, updates });
            setShowEditModal(false);
        }
    };

    const filteredUsers = users || [];
    return (
        <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    User Management: Roles & Access
                </h2>
                <button
                    onClick={handleCreateUser}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add New User
                </button>
            </div>
            <div className="mb-6">
                <Searchbar
                    onSearch={setSearchQuery}
                    placeholder="Search users..."
                />
            </div>

            {usersLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeClasses(
                                                user.role
                                            )}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.isVerified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {user.isVerified
                                                ? 'Verified'
                                                : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.lastLogin
                                            ? new Date(
                                                  user.lastLogin
                                              ).toLocaleDateString()
                                            : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition hover:cursor-pointer"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteUser(
                                                    user._id,
                                                    user.name
                                                )
                                            }
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition hover:cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {(showCreateModal || showEditModal) && (
                <div className="fixed inset-0 bg-zinc-200/30 backdrop-blur-lg bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-15 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white border-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {showCreateModal
                                    ? 'Create New User'
                                    : 'Edit User'}
                            </h3>
                            <form
                                onSubmit={handleFormSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                        required
                                    />
                                </div>
                                {showCreateModal && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                role: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="demo_admin">
                                            Demo Admin
                                        </option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVerified}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isVerified: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Verified
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setShowEditModal(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        {showCreateModal
                                            ? 'Create User'
                                            : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SecurityMaintenancePage = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    const { data: systemData, isPending: isLoading } = useQuery({
        queryKey: ['systemData'],
        queryFn: async () => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const [healthRes, logsRes, maintenanceRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/system/health`, {
                    headers,
                    credentials: 'include',
                }),
                fetch(`${API_URL}/api/admin/security/logs`, {
                    headers,
                    credentials: 'include',
                }),
                fetch(`${API_URL}/api/admin/maintenance/info`, {
                    headers,
                    credentials: 'include',
                }),
            ]);

            const healthData = healthRes.ok ? await healthRes.json() : null;
            const logsData = logsRes.ok ? await logsRes.json() : null;
            const maintenanceData = maintenanceRes.ok
                ? await maintenanceRes.json()
                : null;

            return {
                systemHealth: healthData?.data,
                securityLogs: logsData?.data,
                maintenanceInfo: maintenanceData?.data,
            };
        },
    });

    const clearCacheMutation = useMutation({
        mutationFn: async () => {
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const response = await fetch(
                `${API_URL}/api/admin/maintenance/clear-cache`,
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to clear cache');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success('Cache cleared successfully!');
            queryClient.invalidateQueries({ queryKey: ['systemData'] });
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'Error clearing cache');
            }
        },
    });

    const { systemHealth, securityLogs, maintenanceInfo } = systemData || {};

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    return (
        <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Security & Maintenance
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() =>
                            queryClient.invalidateQueries({
                                queryKey: ['systemData'],
                            })
                        }
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 disabled:opacity-50"
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <button
                        onClick={() => clearCacheMutation.mutate()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                    >
                        Clear Cache
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading system data...</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Shield className="mr-2 text-teal-600" size={20} />
                        System Health
                    </h3>
                    {systemHealth ? (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Platform:</span>
                                <span className="font-medium">
                                    {systemHealth.system?.platform || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Architecture:
                                </span>
                                <span className="font-medium">
                                    {systemHealth.system?.arch || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Uptime:</span>
                                <span className="font-medium">
                                    {systemHealth.system?.uptime
                                        ? formatUptime(
                                              systemHealth.system.uptime
                                          )
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Memory Usage:
                                </span>
                                <span className="font-medium">
                                    {systemHealth.system?.freeMemory &&
                                    systemHealth.system?.totalMemory
                                        ? `${formatBytes(
                                              systemHealth.system.totalMemory -
                                                  systemHealth.system.freeMemory
                                          )} / ${formatBytes(
                                              systemHealth.system.totalMemory
                                          )}`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Database Status:
                                </span>
                                <span
                                    className={`font-medium ${
                                        systemHealth.database?.status ===
                                        'connected'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {systemHealth.database?.status || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Node Version:
                                </span>
                                <span className="font-medium">
                                    {systemHealth.application?.nodeVersion ||
                                        'N/A'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No system health data available
                        </p>
                    )}
                </div>

                {/* Security Logs */}
                {/* Not Functional */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Bell className="mr-2 text-orange-600" size={20} />
                        Security Overview
                    </h3>
                    {securityLogs ? (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Active Users (24h):
                                </span>
                                <span className="font-medium">
                                    {securityLogs.activeUsers || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Recent Logins:
                                </span>
                                <span className="font-medium">
                                    {securityLogs.recentLogins?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Security Alerts:
                                </span>
                                <span className="font-medium text-red-600">
                                    {securityLogs.securityAlerts?.length || 0}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No security data available
                        </p>
                    )}
                </div>

                {/* Maintenance Info */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Settings className="mr-2 text-blue-600" size={20} />
                        Maintenance Information
                    </h3>
                    {maintenanceInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-teal-600">
                                    {maintenanceInfo.users?.totalUsers || 0}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Users
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {maintenanceInfo.contacts?.totalMessages ||
                                        0}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Messages
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {maintenanceInfo.contacts?.unreadMessages ||
                                        0}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Unread Messages
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {maintenanceInfo.database?.collections || 0}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Database Collections
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No maintenance data available
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const NotificationsAlertsPage = () => {
    const { user, token } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: messages,
        isPending: isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['contactMessages'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/contact`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to fetch messages'
                );
            }
            const result = await response.json();
            return result.data;
        },
        enabled: user?.role === 'admin' || user?.role === 'demo_admin',
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (messageId) => {
            const response = await fetch(
                `${API_URL}/api/contact/${messageId}/read`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to mark as read');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
            toast.success('Message marked as read.');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'An error occurred.');
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (messageId) => {
            const response = await fetch(
                `${API_URL}/api/contact/${messageId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to delete message'
                );
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
            toast.success('Message deleted!');
        },
        onError: (error) => {
            if (error.message === 'Action disabled in Demo mode.') {
                toast.error('This action is disabled in demo mode.');
            } else {
                toast.error(error.message || 'An error occurred.');
            }
        },
    });

    if (user?.role !== 'admin' && user?.role !== 'demo_admin') {
        return (
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Notifications & Alerts
                </h2>
                <div className="p-6 bg-white rounded-xl shadow">
                    You do not have permission to view this page.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Contact Messages
                </h2>
                <div className="p-6 bg-white rounded-xl shadow">
                    Loading messages...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Contact Messages
                </h2>
                <div className="p-6 bg-white rounded-xl shadow text-red-500">
                    Error: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">
                Contact Form Messages
            </h2>
            <div className="space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`p-6 rounded-xl shadow ${
                                message.isRead ? 'bg-gray-100' : 'bg-white'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">
                                        {message.subject}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        From: {message.name} ({message.email})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Received:{' '}
                                        {new Date(
                                            message.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {!message.isRead && (
                                        <button
                                            onClick={() =>
                                                markAsReadMutation.mutate(
                                                    message._id
                                                )
                                            }
                                            disabled={
                                                markAsReadMutation.isPending
                                            }
                                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    'Are you sure you want to delete this message?'
                                                )
                                            ) {
                                                deleteMutation.mutate(
                                                    message._id
                                                );
                                            }
                                        }}
                                        disabled={deleteMutation.isPending}
                                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4">{message.message}</p>
                        </div>
                    ))
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow">
                        No messages found.
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('UserManagement');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const renderView = () => {
        switch (currentView) {
            case 'Analytics':
                return <AnalyticsPage />;
            case 'ContentManagement':
                return <ContentManagementPage />;
            case 'UserManagement':
                return <UserManagementPage />;
            case 'SecurityMaintenance':
                return <SecurityMaintenancePage />;
            case 'NotificationsAlerts':
                return <NotificationsAlertsPage />;
            default:
                return (
                    <h2 className="text-2xl font-bold p-6">
                        View Not Found: {currentView}
                    </h2>
                );
        }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="">
                <DashboardHeader toggleSidebar={toggleSidebar} user={user} />
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    logout={logout}
                />
                <main
                    className={`pt-12 transition-all duration-300 ease-in-out ${
                        isSidebarOpen ? 'lg:pl-64' : ''
                    }`}
                >
                    {renderView()}
                </main>
            </div>
        </div>
    );
};
