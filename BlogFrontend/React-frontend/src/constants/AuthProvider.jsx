import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './links';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children, queryClient }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    // Add a loading state to prevent flickering
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(false);
    }, []);

    // Add this effect to sync logout across tabs
    useEffect(() => {
        const syncLogout = (event) => {
            if (event.key === 'token' && !event.newValue) {
                console.log('Token removed from storage, logging out.');
                setToken(null);
                setUser(null);
                if (queryClient) {
                    queryClient.clear();
                }
                navigate('/');
            } else if (event.key === 'user' && !event.newValue) {
                console.log('User removed from storage, logging out.');
                setToken(null);
                setUser(null);
                if (queryClient) {
                    queryClient.clear();
                }
                navigate('/');
            }
        };

        window.addEventListener('storage', syncLogout);

        return () => {
            window.removeEventListener('storage', syncLogout);
        };
    }, [navigate, queryClient]);

    const login = (newToken, userData) => {
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Also clear the old, stale key as a safety measure
        localStorage.removeItem('authToken');
        queryClient.clear();
        navigate('/');
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/auth/google`;
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isLoggedIn = !!token && !!user; // Stricter check: must have both

    const value = {
        user,
        setUser: updateUser,
        token,
        isLoggedIn,
        loading, // Expose loading
        login,
        logout,
        handleGoogleLogin, // Expose the new function
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};


