import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../constants/AuthContext';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { googleLogin } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get('token');
        console.log('Token from URL:', token);

        if (token) {
            // Pass the token to Context. Context will fetch the user data.
            googleLogin(token).then((success) => {
                if (success) {
                    console.log('Login successful, redirecting...');
                    navigate('/blogpage', { replace: true });
                } else {
                    console.log('Login failed during profile fetch');
                    navigate('/login', { replace: true });
                }
            });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate, googleLogin]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Verifying your account...</p>
        </div>
    );
};

export default AuthCallback;
