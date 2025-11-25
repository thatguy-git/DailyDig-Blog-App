import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
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

    const updateUser = (userData) => {
        setUser(userData); // 1. Update UI instantly
        localStorage.setItem('user', JSON.stringify(userData)); // 2. Persist to storage
    };

    const isLoggedIn = !!token || !!user;
    // expose setUser so pages (ProfilePage) can update context after fetching/updating profile
    const value = {
        user,
        setUser: updateUser,
        token,
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
