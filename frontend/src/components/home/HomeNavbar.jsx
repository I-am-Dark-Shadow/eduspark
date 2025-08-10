import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuChevronDown, LuMenu, LuX, LuPhoneCall } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const HomeNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Updated paths to use hash links
    const navLinks = [
        { name: 'Home', path: '/#home' },
        // { name: 'Features', path: '/#features' },
        { name: 'About Us', path: '/#about-us' },
        // { name: 'Testimonials', path: '/#testimonials' },
        { name: 'Why Choose Us', path: '/#why-choose-us' },
        // { name: 'Stats', path: '/#stats' },
        { name: 'Code', path: '/#cta' },
        // { name: 'Instructors', path: '/#instructors' },
        { name: 'Courses', path: '/#blog' },
    ];

    return (
        <header className="bg-white md:bg-white/90 backdrop- sticky top-0 z-20 border-b border-border-color">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="EduSpark Logo" className="w-10 h-10" />
                    <span className="text-2xl font-bold text-on-surface">EdunSpark</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.path} className="font-semibold text-on-surface hover:text-primary transition-colors">
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/" className="bg-primary md:block hidden  text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-orange-600 transition-colors">
                        <div className="flex items-center gap-2">
                            <LuPhoneCall /> +91 8167266006
                        </div>
                    </Link>
                    <button onClick={toggleMenu} className="lg:hidden p-2 bg-orange-500 rounded-xl">
                        <LuMenu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-64 bg-white  shadow-lg z-40 p-4 lg:hidden"
                    >
                        <nav className="flex flex-col gap-4  p-4 ">
                            <button onClick={toggleMenu} className="p-2 w-fit bg-orange-500 rounded-xl">
                                <LuX size={24} />
                            </button>
                            {navLinks.map(link => (
                                <a key={link.name} href={link.path} onClick={toggleMenu} className="font-semibold text-on-surface py-2 text-lg hover:text-primary ">
                                    {link.name}
                                </a>
                            ))}
                            <Link to="/" className="bg-primary flex items-center gap-2 w-fit -ml-2 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-orange-600 transition-colors">
                                <LuPhoneCall /> +91 8167266006
                            </Link>

                        </nav>

                    </motion.div>
                )}
            </AnimatePresence>
            {isMenuOpen && <div onClick={toggleMenu} className="fixed inset-0 bg-black/70 z-30 lg:hidden"></div>}
        </header>
    );
};

export default HomeNavbar;