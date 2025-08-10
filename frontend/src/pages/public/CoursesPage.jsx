import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { LuPlay  , LuClock, LuSearch } from 'react-icons/lu';
import toast from 'react-hot-toast';

const CourseCard = ({ course, onPlay }) => {
    const isComingSoon = course.status === 'coming-soon';
    return (
        <div className="bg-surface rounded-2xl shadow-sm overflow-hidden group border border-border-color flex flex-col">
            <div className="relative overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-56 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isComingSoon && (
                        <button onClick={() => onPlay(course.videoUrl)} className="text-white transform scale-150 group-hover:scale-100 transition-transform">
                            <LuPlay   size={60} />
                        </button>
                    )}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <p className={`text-sm font-semibold mb-2 ${isComingSoon ? 'text-amber-600' : 'text-primary'}`}>
                    {isComingSoon ? 'Coming Soon' : 'Available Now'}
                </p>
                <h3 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors flex-grow">{course.title}</h3>
                <div className="flex items-center justify-between text-on-surface-secondary mt-3 text-sm pt-4 border-t border-border-color">
                    <span className="flex items-center gap-1.5"><LuClock size={16}/> {course.duration}</span>
                    <button 
                        onClick={() => !isComingSoon && onPlay(course.videoUrl)} 
                        disabled={isComingSoon}
                        className={`font-semibold text-sm py-1 px-3 rounded-md transition-colors ${isComingSoon ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-secondary/20 text-secondary hover:bg-secondary/30'}`}
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get(`/api/courses?pageNumber=${page}&keyword=${keyword}`);
                setCourses(data.courses);
                setPage(data.page);
                setPages(data.pages);
            } catch (error) {
                toast.error("Failed to fetch courses.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [page, keyword]);

    // UPDATED: This function now directly opens the link in a new tab.
    const handlePlayVideo = (videoUrl) => {
        window.open(videoUrl, '_blank');
    };

    const searchHandler = (e) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-on-surface mb-8 text-center">Our Courses</h1>
                
                <form onSubmit={searchHandler} className="max-w-xl mx-auto mb-12">
                    <div className="relative">
                        <input 
                            type="text"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search for a course..."
                            className="w-full pl-12 pr-4 py-3 border border-border-color rounded-full bg-surface"
                        />
                        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-secondary" />
                    </div>
                </form>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {courses.map(course => (
                                <CourseCard key={course._id} course={course} onPlay={handlePlayVideo} />
                            ))}
                        </div>
                        
                        {pages > 1 && (
                            <div className="flex justify-center items-center mt-12 space-x-2">
                                {[...Array(pages).keys()].map(x => (
                                    <button 
                                        key={x + 1} 
                                        onClick={() => setPage(x + 1)}
                                        className={`w-10 h-10 rounded-md font-semibold transition-colors ${page === x + 1 ? 'bg-primary text-white' : 'bg-surface hover:bg-border-color'}`}
                                    >
                                        {x + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* The VideoModal is no longer needed here */}
        </div>
    );
};

export default CoursesPage;