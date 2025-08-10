import { motion } from 'framer-motion';
import { LuCheckCheck } from 'react-icons/lu'; // Using the correct icon for your design
import AnimatedBackground from './AnimatedBackground';

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const WhyChooseUsSection = () => {
    return (
        <motion.section 
            className="py-16 sm:py-24 bg-background relative overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30">
                <AnimatedBackground />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div variants={itemVariants}>
                    <span className="font-bold text-primary">WHY CHOOSE US</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 leading-tight">New Approach To Fun Learning</h2>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-4 font-semibold text-on-surface text-lg"><LuCheckCheck className="text-secondary flex-shrink-0" size={24}/> Best Learning</li>
                        <li className="flex items-center gap-4 font-semibold text-on-surface text-lg"><LuCheckCheck className="text-secondary flex-shrink-0" size={24}/> Top Educators</li>
                        <li className="flex items-center gap-4 font-semibold text-on-surface text-lg"><LuCheckCheck className="text-secondary flex-shrink-0" size={24}/> All-in-One Tutor</li>
                        <li className="flex items-center gap-4 font-semibold text-on-surface text-lg"><LuCheckCheck className="text-secondary flex-shrink-0" size={24}/> Affordable</li>
                    </ul>
                </motion.div>
                
                {/* --- RESPONSIVE & DYNAMIC IMAGE COLLAGE --- */}
                <motion.div 
                    className="relative h-[500px]" // Consistent height for the container
                    variants={itemVariants}
                >
                    {/* Decorative dot background */}
                    <div 
                        className="absolute top-0 right-0 w-32 h-32 md:top-0 md:right-1/4 md:w-48 md:h-48 bg-repeat"
                        style={{backgroundImage: 'url("/images/bgdot.png")'}}
                    ></div>

                    {/* Main background image of students */}
                    <img 
                        src="/images/img (12).png" 
                        alt="Students in a classroom" 
                        className="absolute bottom-28 right-0 w-4/5 max-w-[300px] md:w-full md:max-w-lg md:top-[250px] md:left-[140px] border-4 border-white h-auto rounded-2xl object-cover shadow-lg animate-float-slow" 
                    />

                    {/* Teacher image (top left) */}
                    <img 
                        src="/images/img (5).jpg" 
                        alt="Teacher" 
                        className="absolute top-0 left-0 w-2/5 max-w-[200px] md:top-[-50px] md:left-[-50px] md:max-w-[250px] h-auto rounded-2xl object-cover shadow-lg border-4 border-white animate-float-medium" 
                    />
                    
                    {/* Building image (top right) */}
                    <img 
                        src="/images/img (2).jpg" 
                        alt="University building" 
                        className="absolute top-10 right-8 w-1/3 max-w-[120px] md:top-8 md:right-60 md:max-w-[160px] h-auto rounded-2xl object-cover shadow-lg border-4 border-white animate-float-fast" 
                    />

                    {/* 5+ Years of Experience Circle */}
                    <div className="absolute top-28 left-1/4 md:top-1/4 md:left-1/4 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-full shadow-orange-400 flex flex-col items-center justify-center text-center text-white shadow-xl animate-float-fast">
                        <p className="text-3xl md:text-5xl font-bold">5+</p>
                        <p className="font-semibold text-sm md:text-base leading-tight mt-1">Years Of<br/>Experiences</p>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default WhyChooseUsSection;