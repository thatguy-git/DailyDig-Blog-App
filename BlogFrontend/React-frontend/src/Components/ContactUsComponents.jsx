import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../constants/links';

export const BannerImage = ({ imageUrl }) => {
    return (
        <div>
            <div className="hero image w-full mb-16">
                <img
                    src={imageUrl || '/contact us.jpg'}
                    alt="Hero Image"
                    className="rounded-md w-full h-[400px] object-cover shadow-lg max-md:h-[250px]"
                />
            </div>
        </div>
    );
};

export const ContactForm = () => {
    const submitContactMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetch(`${API_URL}/api/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return response.json();
        },
        onSuccess: () => {
            // Success handled in component
        },
        onError: (error) => {
            console.error('Error submitting form:', error);
        },
    });

    // Auto-hide success message after 5 seconds
    useEffect(() => {
        if (submitContactMutation.isSuccess) {
            const timer = setTimeout(() => {
                submitContactMutation.reset();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [submitContactMutation.isSuccess, submitContactMutation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        submitContactMutation.mutate(data, {
            onSuccess: () => {
                e.target.reset();
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-between w-96 max-w-md h-[500px] max-sm:mx-4">
            <form onSubmit={handleSubmit} className="w-full">
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="bg-white w-full h-16 px-4 rounded-lg shadow-lg my-2"
                    placeholder="name"
                />

                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="bg-white w-full h-16 px-4 rounded-lg shadow-lg my-2"
                    placeholder="email"
                />

                <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="bg-white w-full h-16 px-4 rounded-lg shadow-lg my-2"
                    placeholder="subject"
                />

                <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="message....."
                    className="bg-white w-full h-41.5 pt-4 px-4 rounded-lg shadow-lg my-2"
                ></textarea>

                <button
                    type="submit"
                    disabled={submitContactMutation.isPending}
                    className="w-full bg-teal-800 text-white p-4 rounded-lg mt-4 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitContactMutation.isPending
                        ? 'Sending...'
                        : 'Send Message'}
                </button>
            </form>
            {submitContactMutation.isSuccess && (
                <p className="mt-4 text-center text-green-600">
                    Message sent successfully!
                </p>
            )}
            {submitContactMutation.isError && (
                <p className="mt-2 text-center text-red-600">
                    {submitContactMutation.error?.message ||
                        'An error occurred. Please try again later.'}
                </p>
            )}
        </div>
    );
};

export const ContactInfo = () => {
    return (
        <div className="flex flex-col items-center justify-between w-96 max-w-md border-solid shadow-lg rounded-lg bg-white p-8 h-[500px] max-sm:mx-4">
            <a
                href="https://maps.app.goo.gl/2Puts6axavDQuusK7"
                className="w-full max-md:px-4"
            >
                <div className="flex items-center space-x-4 my-4">
                    <i className="fa-solid fa-location-dot text-2xl"></i>
                    <p className="text-lg">
                        14C Estaport Avenue, Soluyi,
                        <br />
                        Gbagada, Lagos, Nigeria
                    </p>
                </div>
            </a>
            <a href="tel:+2349030930488" className="w-full max-md:px-4">
                <div className="flex items-center space-x-4 my-4">
                    <i className="fa-solid fa-phone text-2xl"></i>
                    <p className="text-lg">
                        +234 903 093 0488
                        <br />
                        +2349030930488
                    </p>
                </div>
            </a>
            <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=davidkiing1400@gmail.com&su=Hello&body=I%20wanted%20to%20reach%20out..."
                className="w-full max-md:px-4"
            >
                <div className="flex items-center space-x-4 my-4">
                    <i className="fa-solid fa-envelope text-2xl"></i>
                    <p className="text-lg">
                        davidkiing1400@gmail.com
                        <br />
                        thatguy@gmail.com
                    </p>
                </div>
            </a>
            <a
                href="https://x.com/thatXguy_?t=cZOoNL3osYF-mxiLpVey7w&s=09"
                className="w-full max-md:px-8"
            >
                <div className="flex items-center space-x-4 my-4">
                    <i className="fa-brands fa-x-twitter text-2xl"></i>
                    <p className="text-lg">
                        thatguy_
                        <br />
                        @thatXguy_
                    </p>
                </div>
            </a>
        </div>
    );
};

export const ContactUsBody = () => {
    return (
        <>
            <div className="flex flex-row max-md:flex-col items-stretch justify-center gap-24 mb-16 max-sm:px-4">
                <ContactInfo />
                <ContactForm />
            </div>
        </>
    );
};
