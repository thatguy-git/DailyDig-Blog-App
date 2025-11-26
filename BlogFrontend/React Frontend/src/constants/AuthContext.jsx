import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        navigate('/');
    };

    // --- NEW FUNCTION ---
    const googleLogin = async (newToken) => {
        try {
            // 1. Temporarily save token so we can use it for the request
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // 2. Fetch the user's profile from your backend
            // ⚠️ MAKE SURE THIS ROUTE EXISTS IN YOUR BACKEND (See Step 3 below)
            const response = await fetch(
                'http://localhost:3000/api/user/profile',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const userData = await response.json();
                // 3. Now we have both Token AND User Data -> Login fully
                login(newToken, userData);
                return true;
            } else {
                console.error('Failed to fetch user profile');
                logout(); // Cleanup if failed
                return false;
            }
        } catch (error) {
            console.error('Google login error:', error);
            logout();
            return false;
        }
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
        googleLogin, // Expose the new function
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
