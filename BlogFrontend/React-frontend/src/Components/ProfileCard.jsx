import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    const month = date
        .toLocaleString('default', { month: 'long' })
        .toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();
    const ordinal = (n) => {
        if (n > 3 && n < 21) return 'TH';
        switch (n % 10) {
            case 1:
                return 'ST';
            case 2:
                return 'ND';
            case 3:
                return 'RD';
            default:
                return 'TH';
        }
    };
    return `${month} ${day}${ordinal(day)} ${year}`;
};

const ProfileCard = ({ blog = {} }) => {
    const { title, featuredImage, createdAt } = blog;
    const date = formatDate(createdAt);
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');

    return (
        <Link
            to={`/post/${blog._id}`}
            className="flex flex-col overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="shrink-0">
                <img
                    src={image}
                    alt={altText}
                    className="h-48 w-full object-cover"
                />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-teal-50 p-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-teal-600">
                        <time dateTime={createdAt}>{date}</time>
                    </p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">
                        {title}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;
