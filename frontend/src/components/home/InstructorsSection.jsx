import AnimatedBackground from './AnimatedBackground'; // Import the background

const InstructorCard = ({ name, title, image }) => (
    <div className="text-center group">
        <div className="relative inline-block">
            <img src={image} alt={name} className="w-48 h-48 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg" />
        </div>
        <h3 className="text-xl font-bold text-on-surface">{name}</h3>
        <p className="text-on-surface-secondary">{title}</p>
    </div>
);

const InstructorsSection = () => {
    return (
        // Added relative and overflow-hidden for the background effect
        <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
            {/* Layer 1: The animated background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <AnimatedBackground />
            </div>

            {/* Layer 2: Your main content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-on-surface text-center mb-12">Meet Our Instructor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                    <InstructorCard name="Suvrodip Chakroborty" title="Teacher" image="/myimage.jpg" />
                    {/* Add your other instructors back here */}
                    {/* <InstructorCard name="Jhonie Cruz" title="Teacher" image="/images/teacher-2.png" />
                    <Instructor-card name="Jimmy Kimmle" title="Teacher" image="/images/teacher-3.png" />
                    <Instructor-card name="Michael Hamilton" title="Teacher" image="/images/teacher-4.png" /> */}
                </div>
            </div>
        </section>
    );
};

export default InstructorsSection;