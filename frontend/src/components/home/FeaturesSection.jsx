import { motion } from 'framer-motion';
//import AnimatedBackground from './AnimatedBackground'; // Import the background

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeatureCard = ({ title, text, bgColor, iconSrc }) => (
    <motion.div
        variants={cardVariants}
        className={`p-12 rounded-2xl ${bgColor} text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2`}
    >
        <div className="bg-lime-300 border-[4px] border-lime-400 w-[80px] h-[75px] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-500">
            <img src={iconSrc} alt={`${title} icon`} className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-secondary">{text}</p>
    </motion.div>
);

const FeaturesSection = () => {
    return (
        // Added relative and overflow-hidden for the background effect
        <section className="py-16 sm:py-24 relative overflow-hidden">
            {/* Layer 1: The animated background */}
            {/* <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div> */}

            {/* Layer 2: Your main content */}
            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 cursor-pointer relative z-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ staggerChildren: 0.2 }}
            >
                <FeatureCard
                    title="Start Course"
                    text="Discover a variety of courses designed to be engaging and educational for all ages."
                    bgColor="bg-sky-200"
                    iconSrc="/images/featureslogo1.png"
                />
                <FeatureCard
                    title="Expert Teachers"
                    text="Learn from experienced and passionate educators dedicated to your child's success."
                    bgColor="bg-yellow-200"
                    iconSrc="/images/featureslogo2.png"
                />
                <FeatureCard
                    title="Strategic Location"
                    text="Our platform is accessible from anywhere, providing a flexible learning environment."
                    bgColor="bg-sky-200"
                    iconSrc="/images/featureslogo3.png"
                />
            </motion.div>
        </section>
    );
};

export default FeaturesSection;