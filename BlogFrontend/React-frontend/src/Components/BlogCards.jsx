import React, { useRef } from 'react';
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

export const BlogCardA = ({ blog = {}, removeBorder = false }) => {
    const { title, featuredImage, createdAt } = blog;
    const date = formatDate(createdAt);
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');

    // Conditionally assemble the class string for the inner div
    // We include the max-md:border-none which is always present
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <Link
            to={`/post/${blog._id}`}
            className="w-1/4 h-full max-md:w-1/2 my-4"
        >
            <div className={`flex flex-row max-md:flex-col ${borderClass}`}>
                <div className="shrink-0 rounded-lg">
                    <img
                        src={image}
                        alt={altText}
                        className="w-28 h-20 max-md:w-full max-md:h-32 rounded-lg object-cover"
                    />
                </div>
                <div className="p-2 ">
                    <p className="text-sm">{date}</p>
                    <p className="text-base tracking-tighter font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export const BlogCardsA = ({ posts = [] }) => {
    const displayPosts = Array.isArray(posts) ? posts.slice(0, 4) : [];

    return (
        <div className="flex flex-row flex-nowrap w-full gap-4 my-2 h-auto max-md:flex-wrap max-md:gap-1">
            {displayPosts.map((post, index) => (
                <BlogCardA
                    key={post._id}
                    blog={post}
                    removeBorder={index === displayPosts.length - 1}
                />
            ))}
        </div>
    );
};

export const BannerCard = ({ post = {} }) => {
    const { title, featuredImage, createdAt, estimatedReadTime, intro } = post;
    const date = formatDate(createdAt);
    const readTime = estimatedReadTime || '';
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} banner` : 'Banner image');
    const introText = intro || 'Intro unavailable';

    return (
        <Link to={`/post/${post._id}`} className="w-full mx-4">
            <div className=" my-2 pb-6">
                <div className="relative w-full h-[425px] rounded-lg overflow-hidden group">
                    <img
                        src={image || '/blog banner.png'}
                        alt={altText}
                        className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* 1. items-start prevents the child from stretching to full width */}
                    <div className="absolute inset-0 flex flex-col items-start justify-end my-4 px-4 w-full">
                        <div className="w-fit max-w-full backdrop-blur-sm bg-black/40 rounded-xl overflow-hidden p-2">
                            <div className="text-sm text-white px-2">
                                {date}
                            </div>
                            <div className="text-white text-3xl tracking-tighter my-2 font-bold px-2 border-black">
                                {title}
                            </div>
                            <div className="text-white text-lg px-2 line-clamp-2">
                                {introText}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full px-4">
                        <p className="text-white text-base tracking-tighter">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const BlogCardB = ({ blog = {}, removeBorder = false }) => {
    const { title, featuredImage, createdAt, estimatedReadTime } = blog;
    const date = formatDate(createdAt);
    const readTime = estimatedReadTime || '';
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <Link
            to={`/post/${blog._id}`}
            className="min-w-[18rem] overflow-x-auto ... "
        >
            <div className={`flex flex-col ${borderClass} pr-6`}>
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={image}
                        alt={altText}
                        className="w-76 h-56 object-cover rounded-lg
                                                    "
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-white text-sm tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center py-2">
                    <p className="text-sm">{date}</p>
                    <p className="text-lg tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export const BlogCardsB = ({ posts = [] }) => {
    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const displayPosts = Array.isArray(posts) ? posts.slice(0, 10) : [];

    return (
        <div className="pt-6 border-t border-t-zinc-400 w-full">
            <div className="flex justify-between items-center">
                <p className="text-3xl tracking-tighter max-md:text-center">
                    Most Popular
                </p>
                <button
                    onClick={scrollRight}
                    className="text-zinc-500 hover:text-zinc-900 text-2xl font-bold transition duration-300 ease-in-out cursor-pointer"
                >
                    {'>'}
                </button>
            </div>
            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar flex-nowrap flex flex-row space-x-4 my-8 max-md:hidden"
                style={{ maxWidth: '100%' }}
            >
                {displayPosts.map((post, index) => (
                    <BlogCardB
                        key={post._id}
                        blog={post}
                        removeBorder={index === displayPosts.length - 1}
                    />
                ))}
                {displayPosts.length === 0 && (
                    <>
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB />
                        <BlogCardB
                            blog={{
                                title: 'The Illusion of Working',
                                createdAt: '2025-11-08',
                                estimatedReadTime: '6',
                            }}
                        />
                        <BlogCardB
                            blog={{
                                title: 'The Illusion of Yapping',
                                createdAt: '2025-01-01',
                                estimatedReadTime: '4',
                            }}
                        />
                        <BlogCardB
                            blog={{
                                title: 'The Illusion of Thinking',
                                createdAt: '2025-01-01',
                            }}
                            removeBorder={true}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

const BlogCardC1 = ({ blog = {} }) => {
    const { title, featuredImage, createdAt, estimatedReadTime, intro } = blog;
    const date = formatDate(createdAt);
    const readTime = estimatedReadTime || '';
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');
    const introText = intro || 'Intro unavailable';

    return (
        <Link to={`/post/${blog._id}`} className="w-1/2">
            <div className="flex flex-col space-y-4 border-r border-r-zinc-400 pr-6">
                <div className=" relative overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={altText}
                        className="w-full h-[400px] object-cover rounded-lg transform transition-transform duration-500 ease-in-out
                        hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-white text-base tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-sm">{date}</p>
                    <p className="text-4xl tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                    <p className="text-lg my-2 line-clamp-3">{introText}</p>
                </div>
            </div>
        </Link>
    );
};

const BlogCardC2 = ({ blog = {}, removeBorder = false }) => {
    const { title, featuredImage, createdAt, estimatedReadTime, intro } = blog;
    const date = formatDate(createdAt);
    const readTime = estimatedReadTime || '';
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-b border-b-zinc-400 max-md:border-none';
    const introText = intro || 'Intro unavailable';

    return (
        <Link to={`/post/${blog._id}`} className="h-1/3">
            <div className={`flex flex-row gap-4 ${borderClass} pb-6 w-full`}>
                <div className="relative rounded-lg w-1/3">
                    <img
                        src={image}
                        alt={altText}
                        className="w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out
                            hover:scale-x-110"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-white text-sm tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center w-2/3">
                    <p className="text-sm">{date}</p>
                    <p className="text-xl tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                    <p className="text-lg line-clamp-3">{introText}</p>
                </div>
            </div>
        </Link>
    );
};

export const BlogCardsC = ({ posts = [] }) => {
    const displayPosts = Array.isArray(posts) ? posts.slice(0, 4) : []; // Take first 4 posts for editor picks

    return (
        <div className="border-t border-t-zinc-400 pt-6">
            <p className="text-3xl tracking-tighter max-md:text-center">
                Editor Picks
            </p>
            <div className="flex gap-6 my-8 max-md:hidden">
                {displayPosts.length > 0 && (
                    <>
                        <BlogCardC1 blog={displayPosts[0]} />
                        <div className="w-1/2 flex flex-col space-y-6">
                            {displayPosts.slice(1).map((post, index) => (
                                <BlogCardC2
                                    key={post._id}
                                    blog={post}
                                    removeBorder={
                                        index ===
                                        displayPosts.slice(1).length - 1
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
                {displayPosts.length === 0 && (
                    <>
                        <BlogCardC2 />
                        <BlogCardC2 />
                    </>
                )}
            </div>
        </div>
    );
};

const BlogCardD = ({ blog = {}, removeBorder = false }) => {
    const { title, featuredImage, createdAt, estimatedReadTime } = blog;
    const date = formatDate(createdAt);
    const readTime = estimatedReadTime || '';
    const image = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt || (title ? `${title} image` : 'Post image');
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <Link
            to={`/post/${blog._id}`}
            className="min-w-[18rem] overflow-x-auto ... "
        >
            <div className={`flex flex-col ${borderClass} pr-6`}>
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={image}
                        alt={altText}
                        className="w-76 h-56 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-white text-sm tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center py-2">
                    <p className="text-sm">{date}</p>
                    <p className="text-lg tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export const BlogCardsD = ({ posts = [] }) => {
    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const displayPosts = Array.isArray(posts) ? posts.slice(0, 10) : [];

    return (
        <div className="pt-6 border-t border-t-zinc-400 w-full">
            <div className="flex justify-between items-center">
                <p className="text-3xl tracking-tighter max-md:text-center">
                    Recently Added
                </p>
                <button
                    onClick={scrollRight}
                    className="text-zinc-500 hover:text-zinc-900 text-2xl font-bold transition duration-300 ease-in-out cursor-pointer"
                >
                    {'>'}
                </button>
            </div>
            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar flex-nowrap flex flex-row space-x-4 my-8 max-md:hidden"
                style={{ maxWidth: '100%' }}
            >
                {displayPosts.map((post, index) => (
                    <BlogCardD
                        key={post._id}
                        blog={post}
                        removeBorder={index === displayPosts.length - 1}
                    />
                ))}
                {displayPosts.length === 0 && (
                    <>
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD />
                        <BlogCardD
                            blog={{
                                title: 'The Illusion of Thinking',
                                date: 'JANUARY 1st, 2025',
                            }}
                            removeBorder={true}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export const BlogCardE = ({ blogs = [], removeBorder = false }) => {
    // We split the array:
    // - mainPost gets the first item (e.g., blogs[0])
    // - secondaryPosts gets the rest in a new array (e.g., blogs[1], blogs[2], ...)
    const [mainPost, ...secondaryPosts] = Array.isArray(blogs) ? blogs : [];

    // Destructure the main post's data, providing defaults
    const {
        title: mainTitle,
        featuredImage,
        createdAt: mainCreatedAt,
        estimatedReadTime: mainReadTime,
    } = mainPost || {}; // Use || {} as a safety guard if the array is empty

    const mainDate = formatDate(mainCreatedAt);
    const mainImage = featuredImage?.url || '/blog banner.png';
    const altText =
        featuredImage?.alt ||
        (mainTitle ? `${mainTitle} image` : 'Blog post image');

    // --- Dynamic Class for the outer container ---
    // We can still use your removeBorder prop logic
    const containerClass = `w-1/3 flex flex-col pr-4 max-md:pr-0 max-md:w-full ${
        removeBorder
            ? 'max-md:border-none'
            : 'border-r border-r-zinc-400 max-md:border-none'
    }`;

    // Safety check: if no blogs are passed, render nothing
    if (!mainPost) {
        return null;
    }

    return (
        <div className={containerClass}>
            {/* --- 1. Main Post (with Image) --- */}
            <Link to={`/post/${mainPost._id}`}>
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={mainImage}
                        alt={altText}
                        className="rounded-lg h-72 w-full object-cover transform transition-transform duration-500 ease-in-out
                                hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/40 border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-white text-base tracking-tighter">
                            {/* Conditional rendering for read time */}
                            {mainReadTime && `${mainReadTime} mins read`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col border-b border-b-zinc-400 justify-center h-24">
                    <p className="text-sm">{mainDate}</p>
                    <p className="text-lg tracking-tight font-bold leading-tight line-clamp-2">
                        {mainTitle || 'Title unavailable'}
                    </p>
                </div>
            </Link>

            {/* --- 2. Secondary Posts (Text-Only List) --- */}
            {/* We map over the rest of the array */}
            {secondaryPosts.map((post, index) => {
                // Get data for this specific post
                const { title, createdAt } = post;
                const date = formatDate(createdAt);

                // Check if this is the LAST item in the secondary list
                const isLastItem = index === secondaryPosts.length - 1;

                return (
                    <Link to={`/post/${post._id}`} key={post.id || index}>
                        {' '}
                        {/* Don't forget a unique key! */}
                        {/* Conditionally apply classes for the last item
                        to remove the border on mobile, just like your original
                        */}
                        <div
                            className={`flex flex-col border-b border-b-zinc-400 justify-center h-24
                                        ${
                                            isLastItem
                                                ? 'max-md:mb-4 max-md:border-none'
                                                : ''
                                        }`}
                        >
                            <p className="text-sm">{date}</p>
                            <p className="text-lg tracking-tight font-bold leading-tight line-clamp-2">
                                {title}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const postData = [
    {
        id: 1,
        title: 'Exploring Europe on a Budget',
        date: 'MAY 6TH, 2025',
        readTime: '4',
    },
    {
        id: 2,
        title: 'Weekend Projects That Refresh Your Home',
        date: 'JULY 9TH, 2025',
    },
    {
        id: 3,
        title: '10 Simple Habits For a More Fulfilling Life erjk ger fgerfg erfggrug afgiegfiowe gafi wegf u fgeruifg seuirfgukwetf gpawggwe kafgwe fourgsfgkh',
        date: 'FEBRUARY 15TH, 2025',
    },
];

export const BlogCardsE = ({ posts = [] }) => {
    const displayPosts = posts.slice(0, 9);
    const groupedPosts = [];
    for (let i = 0; i < displayPosts.length; i += 3) {
        groupedPosts.push(displayPosts.slice(i, i + 3));
    }

    return (
        <div className="border-t border-t-zinc-400 pt-6">
            <p className="text-3xl tracking-tighter max-md:text-center">
                Highlights
            </p>
            <div className="flex flex-row max-md:flex-col mt-8 space-x-4 max-md:space-x-0 w-full h-full max-md:pl-0 pl-2">
                {groupedPosts.length > 0 ? (
                    groupedPosts.map((group, index) => (
                        <BlogCardE
                            key={index}
                            blogs={group}
                            removeBorder={index === groupedPosts.length - 1}
                        />
                    ))
                ) : (
                    <>
                        <BlogCardE blogs={postData} />
                        <BlogCardE blogs={postData} />
                        <BlogCardE blogs={postData} removeBorder={true} />
                    </>
                )}
            </div>
        </div>
    );
};
