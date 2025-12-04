import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../constants/useAuth';
import { API_URL } from '../constants/links';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get('token');
        console.log('Token from URL:', token);

        const googleLogin = async (newToken) => {
            try {
                // 1. Temporarily save token so we can use it for the request
                localStorage.setItem('token', newToken);

                // 2. Fetch the user's profile from your backend
                const response = await fetch(`${API_URL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    //Now we have both Token and User Data to Login fully
                    login(newToken, userData.user);
                    return true;
                } else {
                    console.error('Failed to fetch user profile');
                    logout();
                    return false;
                }
            } catch (error) {
                console.error('Google login error:', error);
                logout();
                return false;
            }
        };

        if (token) {
            // Pass the token to Context. Context will fetch the user data.
            googleLogin(token).then((success) => {
                if (success) {
                    console.log('Login successful, redirecting...');
                    navigate('/', { replace: true });
                } else {
                    console.log('Login failed during profile fetch');
                    navigate('/login', { replace: true });
                }
            });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate, login]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Verifying your account...</p>
        </div>
    );
};

export default AuthCallback;
