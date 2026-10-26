import React from "react";
import HeroBgVideo from "../common/HeroBgVideo";
import Header from "../common/Header";
import NavigateButton from "../common/NavigateButton";

const Hero = () => {
    return (
        <div
            className="relative min-h-screen w-full overflow-hidden">

            {/* Background video */}
            <HeroBgVideo />

            {/* Hero overlay content */}
            <div
                className="absolute inset-0 z-10 flex min-h-screen flex-col justify-between gap-auto sm:gap-0">

                <Header />

                {/* Hero content */}
                <section
                    className="flex w-full flex-1 items-center px-4 pt-20 sm:px-6 sm:pt-16 md:px-8 lg:px-10">
                    <div
                        className="w-full max-w-6xl rounded-lg p-4 text-left sm:w-[55vw] sm:p-6 md:p-8">

                        <h1
                            className="w-full text-5xl font-bold leading-tight text-white sm:w-[55vw] sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl xl:text-8xl ">
                            Spaces that feel like you.
                        </h1>

                        <p
                            className="mt-3 text-base text-white sm:text-[17px]">
                            Special furniture, lighting, and accessories – curated for a home with personality.
                        </p>

                        <div
                            className="my-5 flex flex-wrap gap-2">
                            <NavigateButton text="Discover" href="/product" />
                            <NavigateButton text="Login" href="/auth/login" />
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};
export default Hero;