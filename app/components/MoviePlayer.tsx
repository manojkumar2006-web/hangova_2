"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X, Settings } from 'lucide-react';

interface MoviePlayerProps {
    filename: string;
    title: string;
    onClose: () => void;
}

export default function MoviePlayer({ filename, title, onClose }: MoviePlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [audioTracks, setAudioTracks] = useState<any[]>([]);
    const [showAudioMenu, setShowAudioMenu] = useState(false);

    let controlsTimeout: NodeJS.Timeout;

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', () => {
                if (isPlaying) setShowControls(false);
            });
        }
        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            clearTimeout(controlsTimeout);
        };
    }, [isPlaying]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Try to access audio tracks if browser supports it
        const checkAudioTracks = () => {
            const tracks = (video as any).audioTracks;
            if (tracks && tracks.length > 1) {
                const availableTracks = [];
                for (let i = 0; i < tracks.length; i++) {
                    availableTracks.push({
                        id: tracks[i].id || i.toString(),
                        label: tracks[i].label || `Track ${i + 1}`,
                        language: tracks[i].language || 'Unknown',
                        enabled: tracks[i].enabled
                    });
                }
                setAudioTracks(availableTracks);
            }
        };

        video.addEventListener('loadedmetadata', checkAudioTracks);
        return () => video.removeEventListener('loadedmetadata', checkAudioTracks);
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            if (isMuted) videoRef.current.volume = volume; // Restore volume when unmuting
            else videoRef.current.volume = 0;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = Number(e.target.value);
        setVolume(vol);
        if (videoRef.current) {
            videoRef.current.volume = vol;
            if (vol > 0 && isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            }
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const switchAudioTrack = (trackId: string) => {
        if (videoRef.current) {
            const tracks = (videoRef.current as any).audioTracks;
            if (tracks) {
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].enabled = (tracks[i].id === trackId || i.toString() === trackId);
                }
                // Re-fetch to update state
                const availableTracks = [];
                for (let i = 0; i < tracks.length; i++) {
                    availableTracks.push({
                        id: tracks[i].id || i.toString(),
                        label: tracks[i].label || `Track ${i + 1}`,
                        language: tracks[i].language || 'Unknown',
                        enabled: tracks[i].enabled
                    });
                }
                setAudioTracks(availableTracks);
                setShowAudioMenu(false);
            }
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.code === 'KeyF') {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.code === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isFullscreen]);

    return (
        <div className="movie-player-overlay">
            <div className={`movie-player-container ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
                {/* Close Button */}
                <button className={`player-close-btn ${showControls ? 'visible' : 'hidden'}`} onClick={onClose}>
                    <X size={32} />
                </button>

                {/* Video Element */}
                <video 
                    ref={videoRef}
                    className="movie-video-element"
                    src={`/api/movies/stream?file=${encodeURIComponent(filename)}`}
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    autoPlay
                />

                {/* Audio Menu Modal */}
                {showAudioMenu && (
                    <div className="audio-menu">
                        <h4>Audio Languages</h4>
                        {audioTracks.length > 0 ? (
                            audioTracks.map(track => (
                                <button 
                                    key={track.id} 
                                    className={`audio-track-btn ${track.enabled ? 'active' : ''}`}
                                    onClick={() => switchAudioTrack(track.id)}
                                >
                                    {track.label} ({track.language})
                                </button>
                            ))
                        ) : (
                            <p className="no-tracks">Multi-audio requires Safari or Chrome flags.</p>
                        )}
                    </div>
                )}

                {/* Glassmorphism Control Bar */}
                <div className={`player-controls ${showControls ? 'visible' : 'hidden'}`}>
                    <div className="progress-container">
                        <input 
                            type="range" 
                            className="player-progress" 
                            min="0" 
                            max={duration || 100} 
                            value={progress} 
                            onChange={handleProgressChange}
                        />
                        <div 
                            className="progress-fill" 
                            style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                        />
                    </div>
                    
                    <div className="controls-row">
                        <div className="controls-left">
                            <button className="control-btn play-btn" onClick={togglePlay}>
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            </button>
                            
                            <div className="volume-group">
                                <button className="control-btn" onClick={toggleMute}>
                                    {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                                <input 
                                    type="range" 
                                    className="volume-slider" 
                                    min="0" 
                                    max="1" 
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                            
                            <span className="time-display">
                                {formatTime(progress)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="controls-right">
                            <h2 className="movie-player-title">{title}</h2>
                            <button 
                                className={`control-btn audio-toggle-btn ${audioTracks.length > 1 ? 'has-audio' : ''}`} 
                                onClick={() => setShowAudioMenu(!showAudioMenu)}
                                title="Audio Languages"
                            >
                                <Settings size={20} />
                            </button>
                            <button className="control-btn" onClick={toggleFullscreen}>
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
