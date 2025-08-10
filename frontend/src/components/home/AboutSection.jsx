import { motion } from 'framer-motion';
import { LuCheckCheck } from 'react-icons/lu';
import AnimatedBackground from './AnimatedBackground'; // Import the animated background

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

const AboutSection = () => {
    return (
        <motion.section 
            className="py-16 sm:py-24 bg-background overflow-hidden relative" // Add relative positioning
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            {/* Layer 1: The new animated background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div>

            {/* Layer 2: The main content */}
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                 <motion.div 
                    className="relative h-[400px] md:h-[500px]" // Adjusted height for more space
                    variants={itemVariants}
                >
                    {/* All 4 images with different positions and animations */}
                    <img 
                        src="/images/img (4).png" 
                        alt="Happy student 1" 
                        className="absolute top-0 left-0 w-3/5 sm:w-64 h-auto rounded-2xl object-cover shadow-lg animate-float-complex-1" 
                    />
                    <img 
                        src="/images/img (8).png" 
                        alt="Student learning 1" 
                        className="absolute bottom-0 right-0 w-3/4 sm:w-80 h-auto rounded-2xl object-cover border-8 border-white shadow-lg animate-float-complex-2" 
                    />
                     <img 
                        src="/images/img (10).png" // New Image 1
                        alt="Happy student 2" 
                        className="hidden sm:block absolute top-0 right-1/4 w-2/5 sm:w-28 h-auto rounded-2xl object-cover border-4 border-white shadow-lg animate-float-complex-2" 
                    />
                     <img 
                        src="/images/img (6).png" // New Image 2
                        alt="Student learning 2" 
                        className="hidden sm:block absolute top-80 left-36 w-2/5 sm:w-40 h-auto rounded-2xl object-cover border-4 border-white shadow-lg animate-float-complex-2" 
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <span className="font-bold text-primary">ABOUT US</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 leading-tight">It's Our Passion To Work With Children At <span className="text-secondary">EduSpark</span>.</h2>
                    <p className="mt-4 text-on-surface-secondary">
                        We believe that a child's early years are crucial for development. Our mission is to provide a safe, nurturing, and stimulating environment where children can thrive.
                    </p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-center gap-3 font-semibold text-on-surface"><LuCheckCheck className="text-primary flex-shrink-0" size={20}/> Quality Educators</li>
                        <li className="flex items-center gap-3 font-semibold text-on-surface"><LuCheckCheck className="text-primary flex-shrink-0" size={20}/> Coding to Learn</li>
                        <li className="flex items-center gap-3 font-semibold text-on-surface"><LuCheckCheck className="text-primary flex-shrink-0" size={20}/> Safety and Security</li>
                        <li className="flex items-center gap-3 font-semibold text-on-surface"><LuCheckCheck className="text-primary flex-shrink-0" size={20}/> Homelike Environment</li>
                    </ul>
                </motion.div>
            </div>
        </motion.section>
    );
};
export default AboutSection;