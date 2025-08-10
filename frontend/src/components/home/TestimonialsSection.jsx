import AnimatedBackground from './AnimatedBackground'; // Import the background

const TestimonialCard = ({ name, text, image }) => (
    <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border-color">
        <div className="text-yellow-400 flex mb-4">★★★★★</div>
        <p className="text-on-surface-secondary mb-6 italic">"{text}"</p>
        <div className="flex items-center gap-4">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-on-surface">{name}</p>
            </div>
        </div>
    </div>
);

const TestimonialsSection = () => {
    return (
        // Added relative and overflow-hidden for the background effect
        <section className="py-16 sm:py-24 relative overflow-hidden">
            {/* Layer 1: The animated background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div>

            {/* Layer 2: Your main content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-on-surface text-center mb-12">What Parents Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard name="Mr. Sharma" text="EduSpark has been a game-changer for my son's education. He is more engaged and excited about learning than ever before." image="/images/parent1.png" />
                    <TestimonialCard name="Mrs. Roy" text="The platform is incredibly user-friendly, and the teachers are fantastic. I highly recommend it to any parent." image="/images/parent3.png" />
                    <TestimonialCard name="Mrs. Ghosh" text="My daughter's confidence has soared since she started using EduSpark. The interactive lessons make learning so much fun!" image="/images/parent2.png" />
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;