import { LuBookOpen, LuUsers, LuVideo, LuTrendingUp } from 'react-icons/lu'; // Corrected icon import
//import AnimatedBackground from './AnimatedBackground'; // Import the background

const StatItem = ({ icon, value, label, iconBgColor }) => (
    <div className="text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${iconBgColor}`}>
            {icon}
        </div>
        <p className="text-4xl sm:text-5xl font-bold text-on-surface">{value}</p>
        <p className="text-on-surface-secondary">{label}</p>
    </div>
);

const StatsSection = () => {
    return (
        // Added relative and overflow-hidden for the background effect
        <section className="py-16 sm:py-24 relative overflow-hidden">
            {/* Layer 1: The animated background */}
            {/* <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div> */}

            {/* Layer 2: Your main content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <StatItem icon={<LuBookOpen size={40} className="text-yellow-600"/>} value="20" label="Total Courses" iconBgColor="bg-yellow-100" />
                <StatItem icon={<LuUsers size={40} className="text-pink-600"/>} value="100" label="Total Students" iconBgColor="bg-pink-100" />
                <StatItem icon={<LuTrendingUp size={40} className="text-orange-600"/>} value="99%" label="Success Rate" iconBgColor="bg-orange-100" />
                <StatItem icon={<LuVideo size={40} className="text-blue-600"/>} value="50" label="Total Videos" iconBgColor="bg-blue-100" />
            </div>
        </section>
    );
};

export default StatsSection;