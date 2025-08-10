import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { LuPlay, LuClock } from 'react-icons/lu';
import AnimatedBackground from './AnimatedBackground'; // Import the background

const PostCard = ({ course, onPlay }) => {
    const isComingSoon = course.status === 'coming-soon';

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden group border border-border-color">
            <div className="relative overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isComingSoon && (
                        <button onClick={() => onPlay(course.videoUrl)} className="text-white transform scale-150 group-hover:scale-100 transition-transform">
                            <LuPlay size={60} />
                        </button>
                    )}
                </div>
            </div>
            <div className="p-6">
                <p className={`text-sm font-semibold mb-2 ${isComingSoon ? 'text-amber-600' : 'text-primary'}`}>
                    {isComingSoon ? 'Coming Soon' : 'Available Now'}
                </p>
                <h3 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="flex items-center justify-between text-on-surface-secondary mt-3 text-sm">
                    <span className="flex items-center gap-1.5"><LuClock size={16} /> {course.duration}</span>
                    <button
                        onClick={() => !isComingSoon && onPlay(course.videoUrl)}
                        disabled={isComingSoon}
                        className={`font-semibold text-base py-2 px-5 rounded-full transition-all duration-300 
    ${isComingSoon
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-sm'
                                : 'bg-secondary/20 text-secondary hover:bg-secondary hover:text-white shadow-md hover:shadow-lg hover:scale-105'
                            }`}
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

const BlogSection = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        api.get('/api/courses')
            .then(res => {
                const sortedCourses = res.data.courses
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .slice(0, 3);
                setCourses(sortedCourses);
            })
            .catch(err => console.error(err));
    }, []);

    const handlePlayVideo = (videoUrl) => {
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <section className="py-16 sm:py-24 relative overflow-hidden">
            {/* Layer 1: The animated background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div>

            {/* Layer 2: Your main content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">Most Popular Courses.</h2>
                    <Link to="/courses" className="mt-4 sm:mt-0 bg-primary text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-orange-600 transition-colors">
                        View All Courses
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <PostCard key={course._id} course={course} onPlay={handlePlayVideo} />
                    ))}
                </div>
            </div>
        </section>
    );
};
export default BlogSection;