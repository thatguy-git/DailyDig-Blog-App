import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Debugging logs to see exactly what is happening
        console.log('AuthCallback Mounted');
        console.log('Full URL:', window.location.href);

        // 1. Get the token from the URL query string
        const token = searchParams.get('token');
        console.log('Extracted Token:', token);

        if (token) {
            // 2. Store the token securely (localStorage is common for this pattern)
            localStorage.setItem('authToken', token);

            // 3. (Optional) Update your global auth state here (e.g., Redux, Context)
            // setUser({ ... })

            // 4. Redirect the user to their dashboard or home page
            // Using replace: true prevents the user from clicking "back" and landing on this loading screen again
            navigate('/dashboard', { replace: true });
        } else {
            // Handle error: No token found
            console.error(
                'No token found in URL params, redirecting to login...'
            );
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    // Show a loading spinner while processing
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Logging you in...</p>
        </div>
    );
};

export default AuthCallback;
