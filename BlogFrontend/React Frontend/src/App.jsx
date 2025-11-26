import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './constants/AuthContext.jsx';
import { publicLinks, userLinks } from './constants/links.js';
import BlogPage from './Pages/BlogPage';
import { PostPage } from './Pages/PostPage';
import ContactUs from './Pages/ContactUs';
import AboutUs from './Pages/AboutUs';
import HomePage from './Pages/HomePage';
import WriteStory from './Pages/WriteStory';
import Signup from './Pages/SignUps';
import { LogIn } from './Pages/LogIn';
import { Dashboard } from './Pages/Dashboard';
import ResetPassword from './Pages/ResetPassword';
import VerifyOTP from './Pages/VerifyOTP';
import { VerifyEmail } from './Pages/VerifyEmail';
import ProfilePage from './Pages/ProfilePage';
import Navbar from './Components/Navbar';
import WriteStoryButton from './Components/WriteStoryButton.jsx';
import toast, { Toaster } from 'react-hot-toast';
import AuthCallback from './Components/AuthCallback.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    if (!isLoggedIn) return children;
    // If logged in, redirect by role
    if (user?.role === 'admin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/blog" replace />;
};

const App = () => {
    const location = useLocation();
    const { isLoggedIn, user, logout } = useAuth();

    // Handle logout navigation
    const handleLogout = () => {
        logout();
    };

    const notify = () => {
        toast('Wow so easy!');
        toast.success('Success notification!');
        toast.error('Error notification!');
    };

    // Determine links based on auth status
    const currentLinks = isLoggedIn ? userLinks : publicLinks;

    // Add logout handler to userLinks if logged in
    const linksWithLogout = isLoggedIn
        ? userLinks.map((link) =>
              link.path === '/logout'
                  ? { ...link, onClick: handleLogout }
                  : link
          )
        : publicLinks;

    // Determine if WriteStoryButton should be hidden
    const hideWriteButtonPaths = [
        '/login',
        '/signup',
        '/write', // Hide on the write page itself
        '/reset-password',
        '/verify-otp',
        '/verify-email',
        '/dashboard', // Optional: Maybe you don't want it on dashboard
    ];

    const shouldShowWriteButton = !hideWriteButtonPaths.includes(
        location.pathname
    );

    // Hide navbar on login, signup, reset-password, verify-otp, verify-email, and dashboard pages
    const hideNavbar = [
        '/login',
        '/signup',
        '/reset-password',
        '/verify-otp',
        '/verify-email',
        '/dashboard',
    ].includes(location.pathname);

    return (
        <>
            {!hideNavbar && (
                <Navbar
                    Links={linksWithLogout}
                    profileImage={user?.profileImage}
                />
            )}
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <HomePage />
                        </PublicRoute>
                    }
                />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LogIn />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/verify-otp"
                    element={
                        <PublicRoute>
                            <VerifyOTP />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/verify-email"
                    element={
                        <PublicRoute>
                            <VerifyEmail />
                        </PublicRoute>
                    }
                />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/callback" element={<AuthCallback />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/write"
                    element={
                        <ProtectedRoute>
                            <WriteStory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {shouldShowWriteButton && <WriteStoryButton />}
            <Toaster />
        </>
    );
};

export default App;
