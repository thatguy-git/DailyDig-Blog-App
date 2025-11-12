import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BarChart3, Settings, LogOut, Menu, X, ArrowUp, Clock, BookOpen, TrendingUp, Share2, Filter, PlusCircle, Trash2, Edit, User, Shield, Bell } from 'lucide-react';

const chartData = [
    { name: 'Jan', 'Page Views': 35000, 'Comments': 180, 'Shares': 1500 },
    { name: 'Feb', 'Page Views': 32000, 'Comments': 160, 'Shares': 1400 },
    { name: 'Mar', 'Page Views': 45000, 'Comments': 250, 'Shares': 2200 },
    { name: 'Apr', 'Page Views': 42000, 'Comments': 210, 'Shares': 1900 },
    { name: 'May', 'Page Views': 55000, 'Comments': 300, 'Shares': 2800 },
    { name: 'Jun', 'Page Views': 58000, 'Comments': 320, 'Shares': 3100 },
];

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

const topPosts = [
    { rank: 1, title: 'The 5 Biggest Trends in AI for 2025', views: '15.2K', shares: '4.1K', comments: 125, date: '2025-06-10' },
    { rank: 2, title: 'Mastering React Props: A Beginner\'s Guide', views: '12.8K', shares: '3.5K', comments: 98, date: '2025-05-28' },
    { rank: 3, title: 'Why Developers Are Switching to Tailwind CSS', views: '9.5K', shares: '2.9K', comments: 74, date: '2025-06-01' },
    { rank: 4, title: 'How to Optimize Blog Images for SEO', views: '6.1K', shares: '1.8K', comments: 32, date: '2025-05-15' },
    { rank: 5, title: '30 Reasons Why Drake is the Greatest Artist of his Generation', views: '1.2k', comments: 22, shares: '1.3k', date: "2025-04-09" },
];

const mockPosts = [
    { id: 101, title: 'The 5 Biggest Trends in AI for 2025', views: '15.2K', clicks: '4.1K', comments: 125, date: '2025-06-10', status: 'Published', author: 'Jane Doe', summary: "Detailed breakdown of next-generation AI models, focusing on diffusion networks and ethical implementation challenges in large-scale enterprise." },
    { id: 102, title: 'Mastering React Props: A Beginner\'s Guide', views: '12.8K', clicks: '3.5K', comments: 98, date: '2025-05-28', status: 'Published', author: 'John Smith', summary: "A step-by-step tutorial on component composition, prop drilling mitigation, and using the children prop for flexible layouts in modern React applications." },
    { id: 103, title: 'Why Developers Are Switching to Tailwind CSS', views: '9.5K', clicks: '2.9K', comments: 74, date: '2025-06-01', status: 'Draft', author: 'Jane Doe', summary: "An opinion piece arguing the benefits of utility-first CSS over traditional methodologies, focusing on development speed and maintainability." },
    { id: 104, title: 'How to Optimize Blog Images for SEO', views: '6.1K', clicks: '1.8K', comments: 32, date: '2025-05-15', status: 'Scheduled', author: 'John Smith', summary: "Technical guide covering image file formats (WebP vs. JPEG), responsive image techniques, lazy loading, and proper alt text structuring for search engines." },
];

const mockUsers = [
    { id: 201, name: 'Alice Johnson', email: 'alice@example.com', role: 'Administrator', status: 'Active', lastLogin: '2025-11-09' },
    { id: 202, name: 'Bob Williams', email: 'bob@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-11-08' },
    { id: 203, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Author', status: 'Active', lastLogin: '2025-11-05' },
    { id: 204, name: 'Dana Scully', email: 'dana@example.com', role: 'Contributor', status: 'Suspended', lastLogin: '2025-10-20' },
    { id: 205, name: 'Eve Martinez', email: 'eve@example.com', role: 'Subscriber', status: 'Active', lastLogin: '2025-11-01' },
];

const getRoleBadgeClasses = (role) => {
    switch (role) {
        case 'Administrator':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'Editor':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Author':
            return 'bg-teal-100 text-teal-800 border-teal-300';
        case 'Contributor':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Subscriber':
            return 'bg-gray-100 text-gray-800 border-gray-300';
        default:
            return 'bg-gray-200 text-gray-700';
    }
}

const navItems = [
    { name: 'Content Management', icon: BookOpen, view: 'ContentManagement' },
    { name: 'Analytics', icon: BarChart3, view: 'Analytics' },
    { name: 'User Management', icon: User, view: 'UserManagement' },
    { name: 'Security & Maintenance', icon: Shield, view: 'SecurityMaintenance' },
    { name: 'Notifications & Alerts', icon: Bell, view: 'NotificationsAlerts' },
];

const StatsCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
    const isPositive = change.startsWith('+');
    
    return (
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColor} ${color} mb-3`}>
            <Icon size={20} />
        </div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <span className={`ml-2 text-sm font-semibold flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUp size={14} className={`inline ${isPositive ? '' : 'rotate-180'}`} />
            {change}
            </span>
        </div>
        </div>
    )
};

const Sidebar = ({ isOpen, toggleSidebar, currentView, setCurrentView }) => {

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
            className={`fixed inset-0 bg-gray-900/50 z-30 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={toggleSidebar}
        ></div>

        {/* Sidebar Content */}
        <nav
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 h-16 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-wider text-teal-400">Daily Dig</h2>
            <button
                onClick={toggleSidebar}
                className="text-white hover:text-teal-300 transition p-1"
            >
                <X size={24} />
            </button>
            </div>

            <div className="flex flex-col justify-between h-[calc(100%-4rem)] p-4">
                <ul className="space-y-2">
                    {navItems.map(item => (
                    <li key={item.name}>
                        <button
                            onClick={() => handleNavigation(item.view)}
                            className={`flex items-center w-full p-3 rounded-xl transition duration-200 ${item.view === currentView 
                            ? 'bg-teal-600 text-white shadow-md' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} className="mr-3" />
            <span className="font-medium whitespace-nowrap">{item.name}</span>
                        </button>
                    </li>
                    ))}
                </ul>
                <div className="pt-4 border-t border-gray-700">
                    <a
                        href="#"
                        className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Sign Out</span>
                    </a>
                </div>
            </div>
        </nav>
        </>
    );
};

const DashboardHeader = ({ toggleSidebar }) => (
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
            {/* Placeholder for user avatar/profile */}
            <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl font-semibold">G</div>
        </div>
        </div>
    </header>
);

const AnalyticsPage = () => (
    <div className='mt-10 py-6 px-4 sm:px-6 lg:px-8'>
                <div className="flex justify-between items-center mb-6 bg-white rounded-lg px-4 py-2">
                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tighter">Traffic & Engagement Analytics</h2>
                    <select className="p-2 border-4 border-gray-300 rounded-lg  focus:ring-white focus:border-white transition duration-150 text-sm">
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Traffic & Engagement Trend</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                onClick={() => {}}
                                style={{ outline: 'none' }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                {/* YAxis for Page Views (left) - Primary Metric */}
                                <YAxis yAxisId="left" stroke="#0d9488" label={{ value: 'Views', angle: -90, position: 'left', fill: '#0d9488' }} />
                                {/* YAxis for Comments (right) - Secondary Metric */}
                                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" label={{ value: 'Comments', angle: 90, position: 'right', fill: '#3b82f6' }} />
                                <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '16px' }} />
                            {/* Page Views line (using left Y-axis) */}
                            <Line yAxisId="left" type="monotone" dataKey="Page Views" stroke="#0d9488" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                            {/* Comments line (using right Y-axis) */}
                            <Line yAxisId="right" type="monotone" dataKey="Comments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Performing Posts (Last 30 Days)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topPosts.map(post => (
                                    <tr key={post.rank} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.rank}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 hover:text-blue-800 cursor-pointer">{post.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.shares}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.comments}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
);

const ContentManagementPage = () => {
    return (
        <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Content Management: All Posts</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150">
                    <PlusCircle size={20} className="mr-2" />
                    Add New Post
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            post.status === 'Published' ? 'bg-green-100 text-green-800' :
                                            post.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => alert(`Editing Post: ${post.title}`)} 
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => alert(`Deleting Post: ${post.title}`)} 
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
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
        </div>
    );
};

const UserManagementPage = () => {
    return (
        <div className="mt-10 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">User Management: Roles & Access</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150">
                    <PlusCircle size={20} className="mr-2" />
                    Add New User
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeClasses(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => alert(`Editing User: ${user.name}`)} 
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition hover:cursor-pointer"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => alert(`Changing status for: ${user.name}`)} 
                                            className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-50 transition hover:cursor-pointer"
                                        >
                                            <Users size={16} />
                                        </button>
                                        <button 
                                            onClick={() => alert(`Deleting User: ${user.name}`)} 
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
        </div>
    );
};

const SecurityMaintenancePage = () => {
    return(
        <div className='mt-10'>
            <h2 className="text-2xl font-semibold mb-4">Security & Maintenance</h2>
            <div className="p-6 bg-white rounded-xl shadow">System health checks, backups, and security logs will go here. Error logs, and any other tecnical information like versioning info..</div>
        </div>
        
    )
};

const NotificationsAlertsPage = () => {
    return(
        <div className='mt-10'>
            <h2 className="text-2xl font-semibold mb-4">Notifications & Alerts</h2>
            <div className="p-6 bg-white rounded-xl shadow">Real-time alerts for failures or high-priority stuff will go here. Any bs information like "Your aws bill is $129..."</div>
        </div>
        
    )
};


export const Dashboard = ()=>{

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('ContentManagement'); 

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
                return <h2 className="text-2xl font-bold p-6">View Not Found: {currentView}</h2>;
            }
        };

    return(
        <div className='min-h-screen'>
            <div className=''>
                <DashboardHeader toggleSidebar={toggleSidebar} />
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
                <main className={`pt-16 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
                    {renderView()}
                </main>
            </div>
            
        </div>
        
        
    )
};
