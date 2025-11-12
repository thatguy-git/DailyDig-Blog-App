import React, { useRef } from 'react';

const BlogCardA = ({ blog = {}, removeBorder = false }) => {
    const { title, img, date } = blog;

    // Conditionally assemble the class string for the inner div
    // We include the max-md:border-none which is always present
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <a href="#" className="w-1/4 h-full max-md:w-1/2 my-4">
            <div className={`flex flex-row max-md:flex-col ${borderClass}`}>
                <div className="shrink-0 rounded-lg">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} image` : 'Post image'}
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
        </a>
    );
};

export const BlogCardsA = () => {
    return (
        <div className=" flex flex-row w-full space-x-4 my-2 h-24 max-md:h-48 max-md:gap-1">
            <BlogCardA
                blog={{
                    title: 'Modern Minimalism: Living with Less for a Richer Life...',
                    date: 'JANUARY 1st, 2025',
                }}
            />
            <BlogCardA
                blog={{
                    title: '20 Reasons to Start a Daily Meditation Practice',
                    date: 'JANUARY 1st, 2025',
                }}
            />
            <BlogCardA
                blog={{
                    title: 'The Illusion of Thinking',
                    date: 'JANUARY 1st, 2025',
                }}
            />
            <BlogCardA
                blog={{
                    title: 'The Illusion of Thinking',
                    date: 'JANUARY 1st, 2025',
                }}
                removeBorder={true}
            />
        </div>
    );
};

export const BannerCard = ({ blog = {} }) => {
    const { title, img, date, readTime = '', intro } = blog;

    return (
        <a href="#" className="w-full mx-4">
            <div className=" my-2 pb-6">
                <div className="relative w-full h-[425px] rounded-lg overflow-hidden group">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} banner` : 'Banner image'}
                        className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col items-start justify-end my-4">
                        <p className="text-sm text-white px-4 py-2 max-md:py-0">
                            {date}
                        </p>
                        <p className="text-white text-3xl tracking-wider font-bold px-4 py-2 max-md:text-2xl max-md:py-0">
                            {title}
                            <br />
                        </p>
                        <p className="text-white text-lg px-4 py-2 max-md:py-0">
                            {intro}
                        </p>
                    </div>
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full px-4">
                        <p className="text-black text-base tracking-tighter">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    );
};

const BlogCardB = ({ blog = {}, removeBorder = false }) => {
    const { title, img, date, readTime = '' } = blog;
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <a href="" className="min-w-[18rem] overflow-x-auto ... ">
            <div className={`flex flex-col ${borderClass} pr-6`}>
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} image` : 'Post image'}
                        className="w-76 h-56 object-cover rounded-lg
                                                    "
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-sm tracking-tighter ">
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
        </a>
    );
};

const BlogCardBBorderless = () => {
    return (
        <a href="" className="min-w-[18rem] overflow-x-auto ... ">
            <div className="flex flex-col pr-6">
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src="\blog banner.png"
                        alt=""
                        className="w-76 h-56 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-sm tracking-tighter ">
                            4 mins read
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center py-2">
                    <p className="text-sm">JUNE 19TH, 2025</p>
                    <p className="text-lg tracking-tight font-bold leading-tight">
                        How To Start Journaling For Mental Clarity
                    </p>
                </div>
            </div>
        </a>
    );
};

export const BlogCardsB = () => {
    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

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
                        date: 'NOVEMBER 8th, 2025',
                        readTime: '6',
                    }}
                />
                <BlogCardB
                    blog={{
                        title: 'The Illusion of Yapping',
                        date: 'JANUARY 1st, 2025',
                        readTime: '4',
                    }}
                />
                <BlogCardB
                    blog={{
                        title: 'The Illusion of Thinking',
                        date: 'JANUARY 1st, 2025',
                    }}
                    removeBorder={true}
                />
            </div>
        </div>
    );
};

const BlogCardC1 = ({ blog = {} }) => {
    const { title, img, date, readTime = '', intro } = blog;

    return (
        <a href="#" className="w-1/2">
            <div className="flex flex-col space-y-4 border-r border-r-zinc-400 pr-6">
                <div className=" relative overflow-hidden rounded-lg">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} image` : 'Post image'}
                        className="w-full h-[400px] object-cover rounded-lg transform transition-transform duration-500 ease-in-out
                        hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-base tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-sm">{date}</p>
                    <p className="text-4xl tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                    <p className="text-lg py-2 line-clamp-3">{intro}</p>
                </div>
            </div>
        </a>
    );
};

const BlogCardC2 = ({ blog = {}, removeBorder = false }) => {
    const { title, img, date, readTime = '', intro } = blog;
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-b border-b-zinc-400 max-md:border-none';

    return (
        <a href="#" className="h-1/3">
            <div className={`flex flex-row gap-4 ${borderClass} pb-6 w-full`}>
                <div className="relative rounded-lg w-1/3">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} image` : 'Post image'}
                        className="w-72 h-40 object-cover rounded-lg transform transition-transform duration-300 ease-in-out
                            hover:scale-x-110"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-sm tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center w-2/3">
                    <p className="text-sm">{date}</p>
                    <p className="text-xl tracking-tight font-bold leading-tight line-clamp-2">
                        {title}
                    </p>
                    <p className="text-lg line-clamp-3">{intro}</p>
                </div>
            </div>
        </a>
    );
};

const BlogCardsC2 = () => {
    return (
        <div className="w-1/2 flex flex-col space-y-6">
            <BlogCardC2
                blog={{
                    title: 'The Illusion of Working',
                    date: 'NOVEMBER 8th, 2025',
                    readTime: '8',
                    intro: 'Learn how to build a personalised self-care routine that fits your lifestyle, brings real results, and support your long-term mental ...',
                }}
                removeBorder={false}
            />
            <BlogCardC2
                blog={{
                    title: 'The Illusion of Working',
                    date: 'NOVEMBER 8th, 2025',
                    readTime: '8',
                    intro: 'Learn how to build a personalised self-care routine that fits your lifestyle, brings real results, and support your long-term mental ...',
                }}
                removeBorder={false}
            />
            <BlogCardC2
                blog={{
                    title: 'The Illusion of Working',
                    date: 'NOVEMBER 8th, 2025',
                    readTime: '8',
                    intro: 'Learn how to build a personalised self-care routine that fits your lifestyle, brings real results, and support your long-term mental ...',
                }}
                removeBorder={true}
            />
        </div>
    );
};

export const BlogCardsC = () => {
    return (
        <div className="border-t border-t-zinc-400 pt-6">
            <p className="text-3xl tracking-tighter max-md:text-center">
                Editor Picks
            </p>
            <div className="flex gap-6 my-8 max-md:hidden">
                <BlogCardC1 />
                <BlogCardsC2 />
            </div>
        </div>
    );
};

const BlogCardD = ({ blog = {}, removeBorder = false }) => {
    const { title, img, date, readTime = '' } = blog;
    const borderClass = removeBorder
        ? 'max-md:border-none'
        : 'border-r border-r-zinc-400 max-md:border-none';

    return (
        <a href="" className="min-w-[18rem] overflow-x-auto ... ">
            <div className={`flex flex-col ${borderClass} pr-6`}>
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={img || '/blog banner.png'}
                        alt={title ? `${title} image` : 'Post image'}
                        className="w-76 h-56 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-sm tracking-tighter ">
                            {readTime && `${readTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col justify-center py-2">
                    <p className="text-sm">{date}</p>
                    <p className="text-lg tracking-tight font-bold leading-tightline-clamp-2">
                        {title}
                    </p>
                </div>
            </div>
        </a>
    );
};

export const BlogCardsD = () => {
    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

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
            </div>
        </div>
    );
};

export const BlogCardE = ({ blogs = [], removeBorder = false }) => {
    // We split the array:
    // - mainPost gets the first item (e.g., blogs[0])
    // - secondaryPosts gets the rest in a new array (e.g., blogs[1], blogs[2], ...)
    const [mainPost, ...secondaryPosts] = blogs;

    // Destructure the main post's data, providing defaults
    const {
        title: mainTitle,
        img: mainImg,
        date: mainDate,
        readTime: mainReadTime,
    } = mainPost || {}; // Use || {} as a safety guard if the array is empty

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
            <a href="#">
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src={mainImg || '/blog banner.png'}
                        alt={
                            mainTitle ? `${mainTitle} image` : 'Blog post image'
                        }
                        className="rounded-lg h-72 w-full object-cover transform transition-transform duration-500 ease-in-out
                                hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-300 backdrop-blur-md border border-teal-500 rounded-full bg-base-200 px-2">
                        <p className="text-black text-base tracking-tighter">
                            {/* Conditional rendering for read time */}
                            {mainReadTime && `${mainReadTime} mins read`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col border-b border-b-zinc-400 justify-center h-24">
                    <p className="text-sm">{mainDate || 'Date unavailable'}</p>
                    <p className="text-lg tracking-tight font-bold leading-tight line-clamp-2">
                        {mainTitle || 'Title unavailable'}
                    </p>
                </div>
            </a>

            {/* --- 2. Secondary Posts (Text-Only List) --- */}
            {/* We map over the rest of the array */}
            {secondaryPosts.map((post, index) => {
                // Get data for this specific post
                const { title, date } = post;

                // Check if this is the LAST item in the secondary list
                const isLastItem = index === secondaryPosts.length - 1;

                return (
                    <a href="#" key={post.id || index}>
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
                    </a>
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

export const BlogCardsE = () => {
    return (
        <div className="border-t border-t-zinc-400 pt-6">
            <p className="text-3xl tracking-tighter max-md:text-center">
                Highlights
            </p>
            <div className="flex flex-row max-md:flex-col mt-8 space-x-4 max-md:space-x-0 w-full h-full max-md:pl-0 pl-2">
                <BlogCardE blogs={postData} />
                <BlogCardE blogs={postData} />
                <BlogCardE blogs={postData} removeBorder={true} />
            </div>
        </div>
    );
};
