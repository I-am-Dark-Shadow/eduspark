import { useState, useRef } from 'react';
import { LuPlay, LuPause, LuVolume2, LuVolumeX } from 'react-icons/lu';
import AnimatedBackground from './AniBackground';

const CtaSection = () => {
    // State to control video playback and sound
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    
    // NEW: State to control when the video loads
    const [loadVideo, setLoadVideo] = useState(false);

    const handlePlayPause = () => {
        if (!loadVideo) {
            // If the video hasn't been loaded yet, load and play it
            setLoadVideo(true);
        } else if (videoRef.current?.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };
    
    // This will run when the video is ready to play
    const onCanPlay = () => {
        setIsPlaying(true);
        videoRef.current.play();
    };

    return (
        <section className="bg-on-surface text-white relative overflow-hidden py-16 sm:py-20 lg:py-24">
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-60">
                <AnimatedBackground />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
                <div className="w-full max-w-4xl h-auto aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden relative border-[3px] border-sky-800">
                    
                    {/* The video element is now only rendered AFTER the user clicks play */}
                    {loadVideo ? (
                        <video
                            ref={videoRef}
                            src="/video.mp4" // Your video file
                            loop
                            muted={isMuted}
                            playsInline
                            onCanPlay={onCanPlay} // Auto-play when ready
                            className="w-full h-full object-cover"
                        ></video>
                    ) : (
                        // Before the click, we show a static thumbnail image
                        <div 
                            className="w-full h-full bg-cover bg-center"
                            // IMPORTANT: Replace this with a path to a thumbnail image for your video
                            style={{ backgroundImage: "url('/')" }}
                        ></div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20">
                        {/* The main play button is always visible until the video starts playing */}
                        {!isPlaying && (
                             <button 
                                onClick={handlePlayPause}
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-sm text-on-surface rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                                aria-label="Play Video"
                            >
                                <LuPlay size={32} className="ml-1" />
                            </button>
                        )}
                    </div>
                    
                    {/* Bottom controls only appear after the video is loaded and playing */}
                    {isPlaying && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
                            <button 
                                onClick={handlePlayPause} 
                                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                            >
                                {isPlaying ? <LuPause size={20} /> : <LuPlay size={20} />}
                            </button>
                            <button 
                                onClick={handleMuteToggle} 
                                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                                aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                            >
                                {isMuted ? <LuVolumeX size={20} /> : <LuVolume2 size={20} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CtaSection;