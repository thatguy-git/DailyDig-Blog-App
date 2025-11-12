import React from 'react'

export const HeroSection = () => {
    return (
        <div>
            <div className="container-2 flex flex-row max-md:flex-col 100vh px-12 py-12 max-md:py-4 max-md:px-2 justify-between items-center max-md:mb-12">
                <div className="hero text mr-8 max-md:w-full max-md:m-2 max-md:text-center">
                    <h1 className="text-5xl font-bold mb-4 max-md:text-4xl">Unearth a New Story Every Day.</h1>
                    <p className="mb-8 text-lg">From forgotten facts to future trends, we dig deep to bring you the stories you won't find anywhere else.</p>
                    <a href="login.html"><button className="bg-teal-800 text-white px-4 py-2 rounded-lg hover:bg-teal-500 w-32 h-16 max-md:h-auto max-md:py-4 max-md:px-10 max-md:w-1/2">Get Started</button></a>
                </div>
                <div className="hero image ml-8 max-md:w-full max-md:m-2 max-md:order-first">
                    <img src="/blog banner.png" alt="Hero Image" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </div>
    )
};

export const HomePageCard =()=>{
    return(
        <div className="card bg-base-100 w-96 max-md:w-auto hover:shadow-lg rounded-lg max-md:my-4 max-md:shadow-lg">
                <figure className="overflow-hidden rounded-lg w-full h-64 max-md:h-48">
                    <img src="/blog banner.png" className="rounded-lg w-full h-full object-cover 
                    transform transition-transform duration-500 ease-in-out
                    hover:scale-125" alt="Shoes" />
                </figure>
                <div className="card-body p-4 max-md:h-auto max-md:px-2">
                    <h2 className="card-title mt-2 max-sm:mt-0 max-md:px-0 max-md:font-bold font-bold">Card Title</h2>
                    <p className="my-2 max-md:tracking-tighter max-md:my-0">A card component has a figure, a body part, and inside body there are title and actions parts</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary bg-teal-800 p-2 rounded-lg text-white hover:bg-teal-500 max-md:hidden">Read Now</button>
                    </div>
                </div>
            </div>
    )
};

export const HomePageCardsSection = () => {
    return(
        <div className='container-3 flex flex-col items-center px-12 max-md:px-4 my-8 max-md:my-4'>
            <p className="text-4xl font-bold text-center underline underline-offset-8 decoration-teal-500  max-md:underline-offset-4 decoration-2 max-md:text-3xl">Featured Stories</p>
            <div className="grid grid-cols-3 gap-16 max-md:flex max-md:flex-col my-8 max-md:my-4 place-items-center max-md:gap-2">
                <HomePageCard />
                <HomePageCard />
                <HomePageCard />
                <HomePageCard />
                <HomePageCard />
                <HomePageCard />
            </div>
        </div>
        
    )
};

export const Mission=()=>{
    return(
        <div className="container-4 mt-16 max-md:mt-2 max-md:px-4">
            <div className="mission">
                <p className="text-4xl font-bold text-center max-md:text-2xl  decoration-teal-500 decoration-2 underline underline-offset-8">Our Mission</p>
                <p className="text-lg text-center mx-24 my-8 max-md:mx-2 max-md:my-4 max-md:tracking-tight max-md:text-left">
                At The Daily Dig, we believe that every day holds a new discovery. In a world full of noise, we're here to do the hard
                work of digging through the surface to unearth the stories you won't find anywhere else. From forgotten history and
                scientific breakthroughs to fascinating cultural quirks and emerging trends, our mission is to deliver a fresh dose of
                insight and inspiration with every post.

                This blog is a home for the curious, the explorers, and the lifelong learners. It's a place where we celebrate the joy
                of finding something new and share it with a community that's just as excited to learn. So, welcome to the dig. Get
                ready to explore.</p>
            </div>
        </div>
    )
};

export const AddStory=()=>{
    return(
        <>
            <div className='container-2 flex flex-col items-center px-0 mx-0'>
                <div className="flex flex-col items-center justify-center w-full gap-8 my-16">
                    <div className="">
                        <p className="text-4xl text font-bold max-md:text-2xl">Write Story</p>
                    </div>
                    <div className="flex flex-col items-center justify-center max-sm:w-full">
                        <input type="text" id="name" name="name" required
                            className="w-full h-16 px-4 rounded-lg shadow-lg my-4 bg-slate-100 max-sm:w-72" placeholder="Title" />
                        <label for="cars">Select Tag</label>
                        <select id="cars" name="cars" className="w-96 h-16 px-4 rounded-lg shadow-lg my-2 bg-slate-100 max-sm:w-72">
                            <option value="volvo">Sports</option>
                            <option value="saab">Science&Technology</option>
                            <option value="fiat">Business</option>
                            <option value="audi">Education</option>
                        </select>
                        
                    </div>
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                    <textarea id="story" name="story" placeholder="Write your story..."
                        className="w-3/4 h-96 px-8 py-8 rounded-lg shadow-lg bg-slate-100 placeholder-gray-500"></textarea>
                    
                    <button className=" bg-teal-800 text-white px-8 py-4 rounded-lg my-8 hover:bg-teal-500 resize-none">Submit</button>
                </div>
            </div>
        </>
    )
};

export const HomePageLayout=()=>{
    return(
        <>
            <HeroSection />
            <HomePageCardsSection />
            <Mission />
        </>   
    )
};

export const SignupLayout =()=>{
    return(
        <div className="container-2 flex flex-col items-center px-24 py-12">
            <p className="text-4xl font-bold text-center decoration-teal-500 decoration-2 max-md:text-2xl mb-6 ">Create Account</p>
            <div className="flex flex-row space-x-4 my-4 w-96 justify-center text-allign h-16">
                <a className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full hover:bg-zinc-300" href="index.html">
                    {/*-- Google Logo --*/}
                    <svg className="w-12 h-20 justify-center items-center" viewBox="0 0 48 48">
                        <path fill="#4285F4"
                            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.6 2.1 30.2 0 24 0 14.6 0 6.4 5.5 2.5 13.5l7.9 6.1C12.5 13 17.8 9.5 24 9.5z" />
                        <path fill="#34A853"
                            d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.8-2 5.2-4.3 6.8l7.9 6.1c4.6-4.2 7.3-10.3 7.3-17.4z" />
                        <path fill="#FBBC05"
                            d="M10.4 28.1c-.5-1.3-.8-2.7-.8-4.1s.3-2.8.8-4.1l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.2l7.9-6.1z" />
                        <path fill="#EA4335"
                            d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5.1 2.4-8.1 2.4-6.2 0-11.5-4.2-13.6-9.9l-7.9 6.1C6.4 42.5 14.6 48 24 48z" />
                    </svg>
                </a>
                <a
                    className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full transition  hover:bg-zinc-300" href="index.html">
                    {/*-- Facebook Logo -- */}
                    <svg className="w-12 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3 3-3 .9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.7h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z" />
                    </svg>
                </a>
                <a className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full hover:bg-zinc-300" href="index.html">
                    {/*-- Twitter Logo --*/}
                    <svg className="w-12 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 3 4s-4 9 5 13a13.1 13.1 0 0 1-8 2c9 5 20 0 20-11.5a4.6 4.6 0 0 0-.1-1z" />
                    </svg>
                </a>
            </div>
            <div className="text-center font-bold mb-4 ">
                Or
            </div>
            <div className="container-4  px-24 ">
                <p className="font-bold text-left my-2" for="name">Username</p>
                <input type="text" id="name" name="name" required className="bg-white w-96 h-16 px-4 rounded-lg shadow-lg mb-4" /><br/>
                <p className="font-bold text-left my-2" for="email">Email</p>
                <input type="email" id="email" name="email" required className="bg-white w-96 h-16 px-4 rounded-lg shadow-lg mb-4" /><br/>
                <p className="font-bold text-left my-2" for="password">Password</p>
                <input type="password" id="password" name="password" className=" bg-white w-96 h-16 rounded-lg px-4 shadow-lg" required
                    placeholder="******************" />
                <p className="text-red-500 text-base italic  mb-8">Please choose a password.</p>
                <a className="" href="index.html">
                    <button className="bg-teal-800 text-white px-4 py-4 w-96 rounded-lg hover:bg-teal-500 font-bold"
                        type="button">Create Account</button><br/><br/>
                </a>
                <div className="text-center w-96 mb-4">
                    <p className="">Have an Account? 
                        <a href="login.html"
                            className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800">Log in
                        </a>
                    </p>
                    
                </div>
            </div>
        </div>
    )
};

export const LoginLayout =()=>{
    return(
        <div className="container-2 flex flex-col items-center px-24 py-12">
            <p className="text-4xl font-bold text-center decoration-teal-500 decoration-2 max-md:text-2xl mb-6 ">Log in to your account </p>
            <div className="flex flex-row space-x-4 my-4 w-96 justify-center text-allign h-16">
                <a className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full hover:bg-zinc-300" href="index.html">
                    {/*-- Google Logo --*/}
                    <svg className="w-12 h-20 justify-center items-center" viewBox="0 0 48 48">
                        <path fill="#4285F4"
                            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.6 2.1 30.2 0 24 0 14.6 0 6.4 5.5 2.5 13.5l7.9 6.1C12.5 13 17.8 9.5 24 9.5z" />
                        <path fill="#34A853"
                            d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.8-2 5.2-4.3 6.8l7.9 6.1c4.6-4.2 7.3-10.3 7.3-17.4z" />
                        <path fill="#FBBC05"
                            d="M10.4 28.1c-.5-1.3-.8-2.7-.8-4.1s.3-2.8.8-4.1l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.2l7.9-6.1z" />
                        <path fill="#EA4335"
                            d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5.1 2.4-8.1 2.4-6.2 0-11.5-4.2-13.6-9.9l-7.9 6.1C6.4 42.5 14.6 48 24 48z" />
                    </svg>
                </a>
                <a
                    className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full transition  hover:bg-zinc-300" href="index.html">
                    {/*-- Facebook Logo -- */}
                    <svg className="w-12 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3 3-3 .9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.7h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z" />
                    </svg>
                </a>
                <a className="flex items-center justify-center gap-2 w-24 px-4 py-2 rounded-full hover:bg-zinc-300" href="index.html">
                    {/*-- Twitter Logo --*/}
                    <svg className="w-12 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 3 4s-4 9 5 13a13.1 13.1 0 0 1-8 2c9 5 20 0 20-11.5a4.6 4.6 0 0 0-.1-1z" />
                    </svg>
                </a>
            </div>
            <div className="text-center font-bold mb-4 ">
                Or
            </div>
            <div className="container-4  px-24 ">
                <p className="font-bold text-left my-2" for="name">Username</p>
                <input type="text" id="name" name="name" required className="bg-white w-96 h-16 px-4 rounded-lg shadow-lg mb-4" /><br/>
                <p className="font-bold text-left my-2" for="email">Email</p>
                <input type="email" id="email" name="email" required className="bg-white w-96 h-16 px-4 rounded-lg shadow-lg mb-4" /><br/>
                <p className="font-bold text-left my-2" for="password">Password</p>
                <input type="password" id="password" name="password" className=" bg-white w-96 h-16 rounded-lg px-4 shadow-lg" required
                    placeholder="******************" />
                <p className="text-red-500 text-base italic  mb-8">Please choose a password.</p>
                <a className="" href="index.html">
                    <button className="bg-teal-800 text-white px-4 py-4 w-96 rounded-lg hover:bg-teal-500 font-bold"
                        type="button">Create Account</button><br/><br/>
                </a>
                <div className="text-center w-96 mb-4">
                    <p className="">Forgot your password? 
                        <a href="login.html"
                            className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800">Reset it
                        </a>
                    </p>
                    <p className="">Don't have an account? 
                        <a href="login.html"
                            className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800">Sign up
                        </a>
                    </p>
                    
                </div>
            </div>
        </div>
    )
};
