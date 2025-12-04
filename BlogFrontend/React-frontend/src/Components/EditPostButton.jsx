import React from 'react';
import { Link } from 'react-router-dom';

const EditPostButton = ({ postId }) => {
    return (
        <Link
            to={`/write-story/${postId}`}
            className="ml-2 p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer transition duration-300"
            title="Edit Post"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
                />
            </svg>
        </Link>
    );
};

export default EditPostButton;
