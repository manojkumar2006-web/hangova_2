"use client";

import React, { useState } from 'react';
import { X, MonitorPlay, Search } from 'lucide-react';

interface MoviePlayerProps {
    tmdbId: number;
    title: string;
    onClose: () => void;
}

export default function MoviePlayer({ tmdbId, title, onClose }: MoviePlayerProps) {
    const [useYouTube, setUseYouTube] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

    const handleYoutubeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Extract video ID from youtube URL
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = youtubeUrl.match(regex);
        if (match && match[1]) {
            setActiveYoutubeId(match[1]);
        }
    };

    return (
        <div className="movie-player-overlay">
            <div className="api-player-container">
                {/* Header Controls */}
                <div className="api-player-header">
                    <h2>{title}</h2>
                    <div className="header-actions">
                        <button 
                            className={`youtube-toggle-btn ${useYouTube ? 'active' : ''}`}
                            onClick={() => setUseYouTube(!useYouTube)}
                            title="Not working or wrong language? Use YouTube Override!"
                        >
                            <MonitorPlay size={20} />
                            <span>YouTube Override</span>
                        </button>
                        <button className="player-close-btn" onClick={onClose}>
                            <X size={28} />
                        </button>
                    </div>
                </div>

                {/* Player Area */}
                <div className="api-iframe-wrapper">
                    {useYouTube ? (
                        <div className="youtube-override-container">
                            {!activeYoutubeId ? (
                                <form onSubmit={handleYoutubeSubmit} className="youtube-form">
                                    <MonitorPlay size={48} className="yt-icon-large" color="#ff0000" />
                                    <h3>YouTube Override Engine</h3>
                                    <p>Many classic Tamil movies are officially on YouTube. Paste the link here to stream it ad-free!</p>
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
                            ) : (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&modestbranding=1&rel=0`} 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="api-iframe"
                                ></iframe>
                            )}
                        </div>
                    ) : (
                        <iframe 
                            src={`https://vidsrc.cc/v2/embed/movie/${tmdbId}`} 
                            allowFullScreen 
                            className="api-iframe"
                            allow="autoplay; fullscreen"
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}
