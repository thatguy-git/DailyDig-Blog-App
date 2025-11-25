import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../constants/AuthContext.jsx';

const WriteStoryButton = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    if (!isLoggedIn) return null;

    return (
        <button
            type="button"
            aria-label="Write a story"
            onClick={() => navigate('/write')}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 hover:cursor-pointer rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors focus:outline-none"
            title="Write a story"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 20h9"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
                />
            </svg>
        </button>
    );
};

export default WriteStoryButton;
