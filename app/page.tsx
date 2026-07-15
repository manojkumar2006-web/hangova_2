"use client";

import { useEffect, useRef, useState } from "react";
import AuthPage from "./components/AuthPage";

type Tab = "home" | "movies" | "music" | "reels" | "dms" | "profile";

export default function HangovaUI() {
    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [activeChannel, setActiveChannel] = useState<string>("home-dash");
    const playerRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const player = playerRef.current;
        const placeholder = placeholderRef.current;

        if (!player || !placeholder) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = player.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            player.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            placeholder.style.transform = `translateZ(40px)`;
        };

        const handleMouseLeave = () => {
            player.style.transform = `perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            placeholder.style.transform = `translateZ(0px)`;
        };

        player.addEventListener("mousemove", handleMouseMove);
        player.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            player.removeEventListener("mousemove", handleMouseMove);
            player.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [activeTab, activeChannel]);

    // Handle switching tabs
    const handleTabSwitch = (tab: Tab, defaultChannel: string) => {
        setActiveTab(tab);
        setActiveChannel(defaultChannel);
    };

    const renderInnerSidebar = () => {
        switch (activeTab) {
            case "home":
                return (
                    <>
                        <div className="sidebar-header">
                            <h2>Hangova Hub</h2>
                        </div>
                        <div className="channel-category">Featured</div>
                        <div 
                            className={`channel ${activeChannel === 'home-dash' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('home-dash')}
                        >
                            <span className="channel-icon">🌟</span> Discovery
                        </div>
                        <div className="channel"><span className="channel-icon">🔥</span> Trending Now</div>
                        <div className="channel-category">Community</div>
                        <div className="channel"><span className="channel-icon">#</span> general-chat</div>
                    </>
                );
            case "movies":
                return (
                    <>
                        <div className="sidebar-header">
                            <h2>Movie Gang</h2>
                        </div>
                        <div className="channel-category">Watch Rooms</div>
                        <div 
                            className={`channel ${activeChannel === 'movie-room' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('movie-room')}
                        >
                            <span className="channel-icon">🛋️</span> Room 1 - Interstellar
                        </div>
                        <div className="channel"><span className="channel-icon">🍿</span> Room 2 - Chill</div>
                    </>
                );
            // ... omitting other tabs sidebar details for brevity but they follow same pattern
            case "dms":
                return (
                    <>
                        <div className="sidebar-header">
                            <h2>Messages & Groups</h2>
                        </div>
                        <div className="channel-category">Private DMs</div>
                        <div 
                            className={`channel ${activeChannel === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('admin')}
                        >
                            <div className="avatar" style={{width: '24px', height: '24px', fontSize: '10px'}}>A</div> Admin
                        </div>
                        <div 
                            className={`channel ${activeChannel === 'friend' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('friend')}
                        >
                            <div className="avatar" style={{width: '24px', height: '24px', fontSize: '10px', background: 'gray'}}>F</div> Friend_01
                        </div>
                        <div className="channel-category">Group Chats (Gangs)</div>
                        <div className="channel">
                            <span className="channel-icon">👥</span> The Boys
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="sidebar-header">
                            <h2>{activeTab.toUpperCase()}</h2>
                        </div>
                        <div className="channel">Select a channel</div>
                    </>
                );
        }
    };

    const renderMainContent = () => {
        // 1. Home Dashboard View
        if (activeTab === 'home' && activeChannel === 'home-dash') {
            return (
                <div className="dashboard-area">
                    <h1 className="dashboard-title">Welcome back, User123 ✨</h1>
                    
                    <h2 className="dashboard-section-title">🎬 Admin&apos;s Top Movie Picks</h2>
                    <div className="media-row">
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">Interstellar</div></div>
                        </div>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">Blade Runner 2049</div></div>
                        </div>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">The Dark Knight</div></div>
                        </div>
                    </div>

                    <h2 className="dashboard-section-title">🎵 Songs to Hear</h2>
                    <div className="media-row">
                        <div className="music-card">
                            <div className="music-cover" style={{backgroundImage: `url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200')`}}></div>
                            <div style={{fontWeight: 700}}>Lo-Fi Chill</div>
                        </div>
                        <div className="music-card">
                            <div className="music-cover" style={{backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200')`}}></div>
                            <div style={{fontWeight: 700}}>Midnight Drive</div>
                        </div>
                        <div className="music-card">
                            <div className="music-cover" style={{backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a1a2b7244985?w=200')`}}></div>
                            <div style={{fontWeight: 700}}>Cyberpunk Synths</div>
                        </div>
                    </div>

                    <h2 className="dashboard-section-title">👥 Recommended Gangs</h2>
                    <div className="media-row">
                        <div className="group-card">
                            <div className="avatar">🍿</div>
                            <div>
                                <div style={{fontWeight: 700}}>Weekend Watchers</div>
                                <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>120 Members</div>
                            </div>
                        </div>
                        <div className="group-card">
                            <div className="avatar">🎧</div>
                            <div>
                                <div style={{fontWeight: 700}}>Audiophiles</div>
                                <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>85 Members</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // 2. Admin DM (Movie Provider View)
        if (activeTab === 'dms' && activeChannel === 'admin') {
            return (
                <div className="dashboard-area">
                    <div className="message" style={{marginBottom: '32px'}}>
                        <div className="msg-avatar admin-avatar">A</div>
                        <div className="msg-content">
                            <span className="msg-author">Admin <span className="badge">OWNER</span></span>
                            <p className="msg-text">Here are the latest movies I&apos;ve updated for you. Click any to start a watch party!</p>
                        </div>
                    </div>
                    
                    <div className="media-row" style={{flexWrap: 'wrap', gap: '24px'}}>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">Interstellar</div></div>
                        </div>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">Blade Runner 2049</div></div>
                        </div>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">The Dark Knight</div></div>
                        </div>
                        <div className="movie-card" style={{backgroundImage: `url('https://images.unsplash.com/photo-1535016120720-40c746a48a93?w=400')`}}>
                            <div className="movie-info"><div className="movie-title">Dune: Part Two</div></div>
                        </div>
                    </div>
                </div>
            );
        }

        // 3. Default Chat/Room View
        return (
            <>
                {/* 3D Movie Player Mockup */}
                {(activeChannel === 'movie-room') && (
                    <div className="media-container">
                        <div ref={playerRef} className="video-player-3d">
                            <div ref={placeholderRef} className="video-placeholder">
                                <div className="play-button">▶</div>
                                <h3>Interstellar (2014)</h3>
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chat-area">
                    <div className="message">
                        <div className="msg-avatar admin-avatar">A</div>
                        <div className="msg-content">
                            <span className="msg-author">Admin <span className="badge">OWNER</span> <span className="msg-time">Today at 10:05 AM</span></span>
                            <p className="msg-text">Welcome to {activeChannel}! Feel free to chat.</p>
                        </div>
                    </div>
                    <div className="message">
                        <div className="msg-avatar user-avatar">U</div>
                        <div className="msg-content">
                            <span className="msg-author">User123 <span className="msg-time">Today at 10:06 AM</span></span>
                            <p className="msg-text">Hello everyone!</p>
                        </div>
                    </div>
                </div>
                
                <div className="message-input-area">
                    <div className="input-wrapper">
                        <button className="attach-btn">+</button>
                        <input type="text" placeholder={`Message in ${activeChannel}...`} className="message-input" />
                        <button className="emoji-btn">😀</button>
                    </div>
                </div>
            </>
        );
    };

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data && e.data.type === 'SHOW_AUTH') {
                setShowAuth(true);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!isLoggedIn) {
        if (showAuth) {
            return <AuthPage onLogin={() => { setIsLoggedIn(true); setShowAuth(false); }} onBack={() => setShowAuth(false)} />;
        }

        return (
            <iframe 
                src="/landing.html?v=2" 
                style={{ width: '100vw', height: '100vh', border: 'none', display: 'block', position: 'absolute', top: 0, left: 0 }}
                title="Hangova Landing Page"
            />
        );
    }

    return (
        <div className="app-container">
            {/* Main Navigation Sidebar */}
            <nav className="servers-sidebar">
                <div 
                    className={`server-icon home-icon tooltip ${activeTab === 'home' ? 'active' : ''}`} 
                    data-tooltip="Home"
                    onClick={() => handleTabSwitch("home", "home-dash")}
                >H</div>
                <div className="server-separator"></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'movies' ? 'active' : ''}`} 
                    data-tooltip="Movies"
                    onClick={() => handleTabSwitch("movies", "movie-room")}
                >🎬</div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'music' ? 'active' : ''}`} 
                    data-tooltip="Music"
                    onClick={() => handleTabSwitch("music", "music-general")}
                >🎵</div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'reels' ? 'active' : ''}`} 
                    data-tooltip="Reels"
                    onClick={() => handleTabSwitch("reels", "reels-foryou")}
                >📱</div>
                <div className="server-separator"></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'dms' ? 'active' : ''}`} 
                    data-tooltip="DMs & Groups"
                    onClick={() => handleTabSwitch("dms", "admin")}
                >💬</div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'profile' ? 'active' : ''}`} 
                    data-tooltip="Profile"
                    onClick={() => handleTabSwitch("profile", "account")}
                >👤</div>
                
                {/* Logout Button */}
                <div style={{ marginTop: 'auto', marginBottom: '16px' }}>
                    <div 
                        className="server-icon gang-icon tooltip" 
                        data-tooltip="Log Out"
                        onClick={() => setIsLoggedIn(false)}
                        style={{ border: '1px dashed #ef4444', color: '#ef4444' }}
                    >
                        🚪
                    </div>
                </div>
            </nav>

            {/* Contextual Inner Sidebar */}
            <aside className="channels-sidebar">
                <div className="sidebar-scrollable-content" style={{flex: 1, overflowY: 'auto'}}>
                    {renderInnerSidebar()}
                </div>

                <div className="user-profile">
                    <div className="avatar">U</div>
                    <div className="user-details">
                        <span className="username">User123</span>
                        <span className="status">Online</span>
                    </div>
                    <div className="profile-actions">⚙️</div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="main-header">
                    <div className="header-title">
                        <span className="channel-icon">{activeTab === 'dms' && activeChannel === 'admin' ? '🎬' : '💬'}</span> 
                        {activeTab === 'home' && activeChannel === 'home-dash' ? 'Discovery' : activeChannel}
                    </div>
                    <div className="header-actions">
                        <button className="action-btn">🔍</button>
                        <button className="action-btn">🔔</button>
                        <button className="action-btn">👥</button>
                    </div>
                </header>
                
                {renderMainContent()}

            </main>
        </div>
    );
}
