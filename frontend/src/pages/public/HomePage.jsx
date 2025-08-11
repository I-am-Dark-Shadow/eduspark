import HeroSection from "../../components/home/HeroSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import AboutSection from "../../components/home/AboutSection";
import CtaSection from "../../components/home/CtaSection";
import StatsSection from "../../components/home/StatsSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import InstructorsSection from "../../components/home/InstructorsSection";
import BlogSection from "../../components/home/BlogSection";
import AnimatedBackground from '../../components/home/AnimatedBackground';
import AniBackground from '../../components/home/AniBackground';
import { useTheme  } from '../../hooks/useTheme'; // custom hook

const HomePage = () => {
    const [theme] = useTheme();
    return (
        <div className="">
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                {theme === 'light' ? <AnimatedBackground /> : <AniBackground />}
            </div>
            <div className="relative z-10 ">
                <section id="home">
                    <HeroSection />
                </section>
                <section id="features">
                    <FeaturesSection />
                </section>
                <section id="about-us">
                    <AboutSection />
                </section>
                <section id="cta">
                    <CtaSection />
                </section>
                <section id="stats">
                    <StatsSection />
                </section>
                <section id="why-choose-us">
                    <WhyChooseUsSection />
                </section>
                <section id="testimonials">
                    <TestimonialsSection />
                </section>
                <section id="instructors">
                    <InstructorsSection />
                </section>
                <section id="blog">
                    <BlogSection />
                </section>
            </div>
        </div>
    );
};

export default HomePage;