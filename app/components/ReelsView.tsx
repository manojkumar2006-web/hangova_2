"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX } from 'lucide-react';

// Simulated database of YouTube Shorts based on Language/Region and Taste
const REELS_DB = {
    'en': { // English / Default
        'Comedy': ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'd-diB65scQU'],
        'Music': ['fJ9rUzIMcZQ', 'RgKAFK5djSk', '3JZ_D3ELwOQ'],
        'Tech': ['M7lc1UVf-VE', 'bTqVqk7FSmY']
    },
    'es': { // Spanish
        'Comedy': ['kJQP7kiw5Fk', 'nu2slyc6mD4'],
        'Music': ['kJQP7kiw5Fk', 'OPf0YbXqDm0'],
        'Tech': ['M7lc1UVf-VE'] // Fallback
    },
    'hi': { // Hindi
        'Comedy': ['V-_O7nl0Ii0', '1w7N8vkFfrw'],
        'Music': ['V-_O7nl0Ii0', 'BddP6PYo2gs', 'YxWlaYCA8MU'],
        'Tech': ['bTqVqk7FSmY'] // Fallback
    }
};

const TASTES = ['Trending', 'Comedy', 'Music', 'Tech'];

export default function ReelsView() {
    const [language, setLanguage] = useState('en');
    const [activeTaste, setActiveTaste] = useState('Trending');
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

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
            // Combine all tastes
            return [...langDb['Comedy'], ...langDb['Music'], ...(langDb['Tech'] || [])];
        }
        return langDb[activeTaste as keyof typeof langDb] || langDb['Comedy'];
    }, [language, activeTaste]);

    return (
        <div className="reels-container" ref={containerRef}>
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

            {/* Scrollable Feed */}
            <div className="reels-feed">
                {currentFeed.map((videoId, index) => (
                    <div key={`${videoId}-${index}`} className="reel-card">
                        <div className="reel-video-container">
                            <iframe 
                                className="reel-iframe"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=${index === 0 ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
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
                ))}
            </div>
        </div>
    );
}
