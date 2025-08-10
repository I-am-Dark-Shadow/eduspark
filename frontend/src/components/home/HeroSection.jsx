import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import AnimatedBackground from './AnimatedBackground';

const HeroSection = () => {
    // Create refs to target the image elements for animation
    const mainImageRef = useRef(null);
    const image1Ref = useRef(null);
    const image2Ref = useRef(null);

    // useEffect to run the GSAP animations once the component mounts
    useEffect(() => {
        // Main image animation
        gsap.to(mainImageRef.current, {
            y: 20, // move up and down by 20px
            duration: 4,
            repeat: -1, // loop forever
            yoyo: true, // reverse the animation
            ease: 'sine.inOut'
        });

        // Floating image 1 animation
        gsap.to(image1Ref.current, {
            y: -15,
            x: 5,
            rotation: 5,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Floating image 2 animation
        gsap.to(image2Ref.current, {
            y: 15,
            x: -5,
            rotation: -5,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }, []);

    return (
        <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <AnimatedBackground />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content Block */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight">
                        The Best place To Learn <span className="text-primary">Computer Science</span>
                    </h1>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        {/* Login Button */}
                        <Link
                            to="/login"
                            className="w-full sm:w-auto bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-pink-500/50 hover:scale-110 hover:brightness-110 transition-all duration-300 text-center"
                        >
                            Login
                        </Link>

                        {/* Contact Button */}
                        <button
                            className="w-full sm:w-auto bg-gradient-to-r from-gray-100 via-white to-gray-100 text-gray-800 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-indigo-500/30 md:hover:scale-110 hover:brightness-105 border border-gray-300 transition-all duration-300"
                        >
                            Contact
                        </button>
                    </div>
                </div>

                {/* Right Image Block with refs for GSAP */}
                <div className="relative h-[300px] lg:h-[500px] flex items-center justify-center">
                    <div ref={mainImageRef} className="relative w-56 h-56 sm:w-72 sm:h-72">
                        <img src="/images/img (11).png" alt="Student learning" className="w-full h-full rounded-full object-cover shadow-2xl" />
                        <div className="absolute inset-0 border-[10px] border-white/50 rounded-full"></div>
                    </div>
                    <img ref={image1Ref} src="/images/img (7).jpg" alt="Student 1" className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full absolute top-8 left-0 shadow-lg border-4 border-white" />
                    <img ref={image2Ref} src="/images/img (9).jpg" alt="Student 2" className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-full absolute top-1/2 -translate-y-1/2 right-0 shadow-lg border-4 border-white" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;