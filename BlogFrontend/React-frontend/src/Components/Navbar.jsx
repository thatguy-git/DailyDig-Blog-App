import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiMenu, HiOutlineMenu } from 'react-icons/hi';
import { LogOut } from 'lucide-react';
import { useAuth } from '../constants/useAuth.js';

const Navbar = () => {
    const { user, logout } = useAuth();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Toggle handler for profile dropdown
    const toggleProfileDropdown = () => {
        setIsProfileOpen((v) => !v);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-zinc-400/20 p-0 mx-0 rounded-b-md shadow-lg sticky top-0 z-10 backdrop-blur-sm">
            <div className="container mx-auto flex justify-between items-center w-full">
                <Link to="/">
                    <img
                        src="/blog_logo-removebg-preview.png"
                        alt="Logo"
                        className="w-20"
                    />
                </Link>
                <div className="flex items-center space-x-8 px-8">
                    <div className="relative"></div>
                </div>
                <div className="flex items-center space-x-4">
                    {/* other nav items (search, notifications, etc.) */}

                    {user ? (
                        <div className="relative mt-4" ref={profileRef}>
                            <button
                                type="button"
                                onClick={toggleProfileDropdown}
                                aria-haspopup="true"
                                aria-expanded={isProfileOpen}
                                className="p-0 bg-transparent rounded-full focus:outline-none"
                            >
                                <img
                                    key={user.profileImage?.url}
                                    src={
                                        user.profileImage?.url ||
                                        '/default-user-icon.svg'
                                    }
                                    alt={
                                        user.name
                                            ? `${user.name} profile`
                                            : 'User profile'
                                    }
                                    className="hover:cursor-pointer w-10 h-10 rounded-full object-cover  hover:opacity-90"
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                                    <Link
                                        to={`/profile/${user._id}`}
                                        onClick={() => setIsProfileOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        View Profile
                                    </Link>
                                    {(user.role === 'admin' ||
                                        user.role === 'demo_admin') && (
                                        <Link
                                            to="/dashboard"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            logout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm text-teal-600 bg-teal-100 px-4 py-2 rounded-md hover:bg-teal-200 font-medium"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
