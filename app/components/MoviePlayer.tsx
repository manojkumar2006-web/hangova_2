"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, MonitorPlay, Search, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import ReactPlayer from 'react-player';

interface MoviePlayerProps {
    tmdbId: number;
    title: string;
    onClose: () => void;
}

export default function MoviePlayer({ tmdbId, title, onClose }: MoviePlayerProps) {
    const [useYouTube, setUseYouTube] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

    // Custom Player State
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);

    let controlsTimeout: NodeJS.Timeout;

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        const container = playerContainerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', () => setShowControls(false));
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', () => setShowControls(false));
            }
            clearTimeout(controlsTimeout);
        };
    }, [isPlaying]);

    const handleYoutubeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = youtubeUrl.match(regex);
        if (match && match[1]) {
            setActiveYoutubeId(match[1]);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    const handleProgress = (state: any) => {
        setPlayed(state.played);
    };

    const handleDuration = (duration: any) => {
        setDuration(duration);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayed = parseFloat(e.target.value);
        setPlayed(newPlayed);
        if (playerRef.current) {
            playerRef.current.seekTo(newPlayed, 'fraction');
        }
    };

    const skipTime = (amount: number) => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(currentTime + amount, 'seconds');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && playerContainerRef.current) {
            playerContainerRef.current.requestFullscreen().catch(err => console.log(err));
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        return `${mm}:${ss}`;
    };

    const renderCustomPlayer = () => {
        if (!activeYoutubeId) {
            return (
                <div className="youtube-override-container">
                    <form onSubmit={handleYoutubeSubmit} className="youtube-form">
                        <MonitorPlay size={48} className="yt-icon-large" color="#ff0000" />
                        <h3>YouTube Override Engine</h3>
                        <p>Many classic Tamil movies are officially on YouTube. Paste the link here to stream it inside our Custom Netflix Player!</p>
                        <div className="yt-input-group">
                            <input 
                                type="text" 
                                placeholder="Paste YouTube Link here..." 
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="yt-input"
                            />
                            <button type="submit" className="yt-submit-btn">
                                <Search size={20} /> Play
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="custom-player-wrapper" ref={playerContainerRef}>
                <div className="react-player-wrapper">
                    <ReactPlayer
                        ref={playerRef}
                        url={`https://www.youtube.com/watch?v=${activeYoutubeId}`}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        volume={volume}
                        muted={isMuted}
                        // @ts-ignore
                        onProgress={handleProgress}
                        // @ts-ignore
                        onDuration={handleDuration}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        config={{
                            youtube: {
                                // @ts-ignore
                                playerVars: { 
                                    controls: 0, // Hides YouTube UI entirely!
                                    disablekb: 1,
                                    modestbranding: 1,
                                    rel: 0,
                                    iv_load_policy: 3
                                }
                            }
                        }}
                        style={{ pointerEvents: 'none' }} // Prevents clicking the invisible youtube video directly
                    />
                </div>

                {/* Invisible Click Overlay for Play/Pause */}
                <div className="click-overlay" onClick={togglePlay}></div>

                {/* Custom Glassmorphism Controls */}
                <div className={`movie-controls-overlay ${showControls ? 'visible' : ''}`}>
                    <div className="controls-header">
                        <h2>{title}</h2>
                        <button className="control-btn" onClick={() => setActiveYoutubeId(null)} title="Change Link">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="controls-bottom">
                        {/* Progress Bar */}
                        <div className="progress-container">
                            <span className="time-display">{formatTime(played * duration)}</span>
                            <input 
                                type="range" 
                                min={0} 
                                max={1} 
                                step="any"
                                value={played} 
                                onChange={handleSeekChange}
                                className="progress-slider"
                                style={{
                                    background: `linear-gradient(to right, #e50914 ${(played * 100)}%, rgba(255, 255, 255, 0.2) ${(played * 100)}%)`
                                }}
                            />
                            <span className="time-display">{formatTime(duration)}</span>
                        </div>

                        {/* Control Buttons */}
                        <div className="controls-row">
                            <div className="controls-left">
                                <button className="control-btn play-btn" onClick={togglePlay}>
                                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                                </button>
                                
                                <button className="control-btn skip-btn" onClick={() => skipTime(-10)} title="Rewind 10s">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
                                </button>
                                <button className="control-btn skip-btn" onClick={() => skipTime(10)} title="Forward 10s">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                                </button>

                                <div className="volume-container">
                                    <button className="control-btn" onClick={toggleMute}>
                                        {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min={0} 
                                        max={1} 
                                        step="any"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => {
                                            setVolume(parseFloat(e.target.value));
                                            setIsMuted(false);
                                        }}
                                        className="volume-slider"
                                    />
                                </div>
                            </div>

                            <div className="controls-right">
                                <button className="control-btn">
                                    <Settings size={24} />
                                </button>
                                <button className="control-btn" onClick={toggleFullscreen}>
                                    <Maximize size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="movie-player-overlay">
            <div className="api-player-container">
                {/* Header Actions for Vidsrc Mode */}
                {!useYouTube && (
                    <div className="api-player-header">
                        <h2>{title}</h2>
                        <div className="header-actions">
                            <button 
                                className={`youtube-toggle-btn`}
                                onClick={() => setUseYouTube(true)}
                                title="Switch to Custom Player Mode via YouTube"
                            >
                                <MonitorPlay size={20} />
                                <span>Custom Netflix Player</span>
                            </button>
                            <button className="player-close-btn" onClick={onClose}>
                                <X size={28} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Player Area */}
                <div className="api-iframe-wrapper">
                    {useYouTube ? (
                        renderCustomPlayer()
                    ) : (
                        <iframe 
                            src={`https://vidsrc.cc/v2/embed/movie/${tmdbId}`} 
                            allowFullScreen 
                            className="api-iframe"
                            allow="autoplay; fullscreen"
                        ></iframe>
                    )}
                </div>
                
                {useYouTube && (
                     <button className="absolute-close-btn" onClick={onClose}>
                        <X size={28} />
                    </button>
                )}
            </div>
        </div>
    );
}
