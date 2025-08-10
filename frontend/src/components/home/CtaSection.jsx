import { useState, useRef } from 'react';
import { LuPlay, LuPause, LuVolume2, LuVolumeX } from 'react-icons/lu';
import AniBackground from './AniBackground'; // Import the new background

const CtaSection = () => {
    // Refs and state for video control
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    // Function to toggle play/pause
    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Function to toggle mute/unmute
    const handleMuteToggle = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
    };

    return (
        <section className="bg-on-surface text-white relative overflow-hidden py-16 sm:py-20 lg:py-28">
            {/* Layer 1: The new animated background (at the very back) */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-70">
                <AniBackground />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
                {/* Main video card with reduced height */}
                <div className="w-full max-w-3xl h-auto aspect-video  rounded-3xl shadow-2xl overflow-hidden relative border-2 border-teal-400">
                    <video
                        ref={videoRef}
                        src="/video.mp4" // Replace with your video file
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-70 "
                    ></video>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
                        {/* Play/Pause Button */}
                        <button 
                            onClick={handlePlayPause} 
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                            aria-label={isPlaying ? "Pause Video" : "Play Video"}
                        >
                            {isPlaying ? <LuPause size={20} /> : <LuPlay size={20} />}
                        </button>

                        {/* Mute/Unmute Button */}
                        <button 
                            onClick={handleMuteToggle} 
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                            aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                        >
                            {isMuted ? <LuVolumeX size={20} /> : <LuVolume2 size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;