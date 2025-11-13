import React from 'react';
import { BannerImage } from './ContactUsComponents';

export const AboutText = () => {
    return (
        <div className="container-2 flex flex-col items-center max-md:pt-8 max-md:px-4 max-md:mb-8">
            <p className="text-4xl font-bold text-center decoration-teal-500 decoration-2 underline underline-offset-8"></p>
            <p className="mt-4 mb-2 text-xl max-md:px-4 max-md:text-base max-md:my-2 px-8 max-md:tracking-wide leading-relaxed">
                At The Daily Dig, we believe that every day holds a new
                discovery. In a world full of noise, we're here to do the hard
                work of digging through the surface to unearth the stories you
                won't find anywhere else. From forgotten history and hidden gems
                to future trends and groundbreaking ideas, our mission is to
                bring you fresh perspectives and captivating narratives that
                inspire curiosity and ignite your imagination.
            </p>
            <p className="my-2 text-xl max-md:px-4 max-md:text-base max-md:my-2 px-8 max-md:tracking-wide">
                Our team of passionate writers and researchers are dedicated to
                exploring a wide range of topics, from science and technology to
                culture and lifestyle. We pride ourselves on our commitment to
                quality journalism, ensuring that every article is thoroughly
                researched, thoughtfully written, and engagingly presented.
            </p>
            <p className="my-2 text-xl max-md:px-4 max-md:text-base max-md:my-2 px-8 max-md:tracking-wide">
                Join us on this exciting journey of discovery. Whether you're a
                lifelong learner, a curious mind, or simply someone who loves a
                good story, The Daily Dig has something for everyone. Dive in,
                explore, and unearth a new story every day with us!
            </p>
        </div>
    );
};

export const AboutUsBody = () => {
    return (
        <div className=" max-md:mt-20">
            <BannerImage imageUrl={'about us dark.jpg'} />
            <AboutText />
        </div>
    );
};
