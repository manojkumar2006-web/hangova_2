"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

// Simulated database of YouTube Shorts based on Language/Region and Taste
const REELS_DB = {
    'en': {
        'Comedy': ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'd-diB65scQU'],
        'Music': ['fJ9rUzIMcZQ', 'RgKAFK5djSk', '3JZ_D3ELwOQ'],
        'Tech': ['M7lc1UVf-VE', 'bTqVqk7FSmY']
    },
    'es': {
        'Comedy': ['kJQP7kiw5Fk', 'nu2slyc6mD4'],
        'Music': ['kJQP7kiw5Fk', 'OPf0YbXqDm0'],
        'Tech': ['M7lc1UVf-VE']
    },
    'hi': {
        'Comedy': ['V-_O7nl0Ii0', '1w7N8vkFfrw'],
        'Music': ['V-_O7nl0Ii0', 'BddP6PYo2gs', 'YxWlaYCA8MU'],
        'Tech': ['bTqVqk7FSmY']
    }
};

const TASTES = ['Trending', 'Comedy', 'Music', 'Tech'];

// ReelCard Component to handle individual YouTube IFrame playback via postMessage
const ReelCard = ({ videoId, isActive, isMuted, index, language, activeTaste }: any) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Send commands to the YouTube Player
    const sendCommand = useCallback((command: string) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: []
            }), '*');
        }
    }, []);

    useEffect(() => {
        if (isActive) {
            sendCommand('playVideo');
        } else {
            sendCommand('pauseVideo');
        }
    }, [isActive, sendCommand]);

    useEffect(() => {
        if (isMuted) {
            sendCommand('mute');
        } else {
            sendCommand('unMute');
        }
    }, [isMuted, sendCommand]);

    return (
        <div className="reel-card" data-index={index}>
            <div className="reel-video-container">
                {/* 
                    Added enablejsapi=1 to allow programmatic control via postMessage 
                    Added html5=1 and playsinline=1 for mobile compatibility
                */}
                <iframe 
                    ref={iframeRef}
                    className="reel-iframe"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isActive ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    tabIndex={-1}
                />
                
                {/* Glassmorphism Sidebar Actions */}
                <div className="reel-actions">
                    <button className="action-btn"><Heart size={28} /></button>
                    <button className="action-btn"><MessageCircle size={28} /></button>
                    <button className="action-btn"><Share2 size={28} /></button>
                    <div className="music-disc">
                        <Music size={20} />
                    </div>
                </div>
                
                {/* Bottom Info */}
                <div className="reel-info">
                    <h3>@hangova_creator</h3>
                    <p>Check out this amazing short! #hangova #{language} #{activeTaste.toLowerCase()}</p>
                </div>
            </div>
        </div>
    );
};

export default function ReelsView() {
    const [language, setLanguage] = useState('en');
    const [activeTaste, setActiveTaste] = useState('Trending');
    const [isMuted, setIsMuted] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const feedRef = useRef<HTMLDivElement>(null);

    // Auto-detect Language & Region
    useEffect(() => {
        const detectLanguage = () => {
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('hi') || browserLang.includes('in')) return 'hi';
            if (browserLang.startsWith('es')) return 'es';
            return 'en'; // Default
        };
        setLanguage(detectLanguage());
    }, []);

    // Get current feed based on detection
    const currentFeed = useMemo(() => {
        const langDb = REELS_DB[language as keyof typeof REELS_DB] || REELS_DB['en'];
        if (activeTaste === 'Trending') {
            return [...langDb['Comedy'], ...langDb['Music'], ...(langDb['Tech'] || [])];
        }
        return langDb[activeTaste as keyof typeof langDb] || langDb['Comedy'];
    }, [language, activeTaste]);

    // Intersection Observer to track which Reel is currently visible
    useEffect(() => {
        const observerOptions = {
            root: feedRef.current,
            rootMargin: '0px',
            threshold: 0.6 // Trigger when 60% of the video is visible
        };

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        setActiveIndex(index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        
        // Observe all reel cards
        const cards = document.querySelectorAll('.reel-card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [currentFeed]); // Re-bind observer if feed changes

    // Reset index when changing feeds
    useEffect(() => {
        setActiveIndex(0);
        if (feedRef.current) {
            feedRef.current.scrollTo(0, 0);
        }
    }, [currentFeed]);

    // Navigation functions
    const scrollNext = useCallback(() => {
        if (feedRef.current) {
            feedRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
    }, []);

    const scrollPrev = useCallback(() => {
        if (feedRef.current) {
            feedRef.current.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        }
    }, []);

    // Keyboard Navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling to ensure our smooth scroll handles it
            if (e.key === 'PageDown' || e.key === 'ArrowDown') {
                e.preventDefault();
                scrollNext();
            } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
                e.preventDefault();
                scrollPrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scrollNext, scrollPrev]);

    return (
        <div className="reels-container">
            {/* Taste Chips Header */}
            <div className="reels-header">
                {TASTES.map(taste => (
                    <button 
                        key={taste} 
                        className={`taste-chip ${activeTaste === taste ? 'active' : ''}`}
                        onClick={() => setActiveTaste(taste)}
                    >
                        {taste}
                    </button>
                ))}
            </div>

            {/* Mute Toggle */}
            <button className="reels-mute-toggle" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={24} color="#fff" /> : <Volume2 size={24} color="#fff" />}
            </button>

            {/* Navigation Controls */}
            <div className="reels-nav-controls">
                <button className="nav-btn" onClick={scrollPrev} disabled={activeIndex === 0}>
                    <ChevronUp size={32} />
                </button>
                <button className="nav-btn" onClick={scrollNext} disabled={activeIndex === currentFeed.length - 1}>
                    <ChevronDown size={32} />
                </button>
            </div>

            {/* Scrollable Feed */}
            <div className="reels-feed" ref={feedRef}>
                {currentFeed.map((videoId, index) => (
                    <ReelCard 
                        key={`${videoId}-${index}`}
                        videoId={videoId}
                        index={index}
                        isActive={index === activeIndex}
                        isMuted={isMuted}
                        language={language}
                        activeTaste={activeTaste}
                    />
                ))}
            </div>
        </div>
    );
}
