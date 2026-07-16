"use client";

import { useEffect, useRef, useState } from "react";
import AuthPage from "./components/AuthPage";
import ReelsView from "./components/ReelsView";
import { Home, Film, Music, Smartphone, MessageCircle, User, LogOut, Star, Flame, Hash, MonitorPlay, Settings, Palette, Bell, Lock, Search, Users, Plus, Smile } from "lucide-react";

type Tab = "home" | "movies" | "music" | "reels" | "dms" | "profile";

export default function HangovaUI() {
    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{username: string, email: string} | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [activeChannel, setActiveChannel] = useState<string>("home-dash");
    
    // Settings State
    const [settings, setSettings] = useState({
        theme: "dark",
        glowIntensity: 50,
        pushNotifications: true,
        emailAlerts: false,
        onlineStatus: true,
        readReceipts: true,
    });

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
                            <span className="channel-icon"><Star size={18} /></span> Discovery
                        </div>
                        <div className="channel"><span className="channel-icon"><Flame size={18} /></span> Trending Now</div>
                        <div className="channel-category">Community</div>
                        <div className="channel"><span className="channel-icon"><Hash size={18} /></span> general-chat</div>
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
                            <span className="channel-icon"><MonitorPlay size={18} /></span> Room 1 - Interstellar
                        </div>
                        <div className="channel"><span className="channel-icon"><MonitorPlay size={18} /></span> Room 2 - Chill</div>
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
                            <span className="channel-icon"><Users size={18} /></span> The Boys
                        </div>
                    </>
                );
            case "profile":
                return (
                    <>
                        <div className="sidebar-header">
                            <h2>SETTINGS</h2>
                        </div>
                        <div className="channel-category">User Settings</div>
                        <div 
                            className={`channel ${activeChannel === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('account')}
                        >
                            <span className="channel-icon"><User size={18} /></span> My Account
                        </div>
                        <div 
                            className={`channel ${activeChannel === 'appearance' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('appearance')}
                        >
                            <span className="channel-icon"><Palette size={18} /></span> Appearance
                        </div>
                        <div className="channel-category">App Settings</div>
                        <div 
                            className={`channel ${activeChannel === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('notifications')}
                        >
                            <span className="channel-icon"><Bell size={18} /></span> Notifications
                        </div>
                        <div 
                            className={`channel ${activeChannel === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveChannel('privacy')}
                        >
                            <span className="channel-icon"><Lock size={18} /></span> Privacy & Safety
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
        if (activeTab === 'reels') {
            return <ReelsView />;
        }

        // 1. Home Dashboard View
        if (activeTab === 'home' && activeChannel === 'home-dash') {
            return (
                <div className="dashboard-area">
                    <h1 className="dashboard-title">Welcome back, User123 ✨</h1>
                    
                    <h2 className="dashboard-section-title">Admin&apos;s Top Movie Picks</h2>
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

                    <h2 className="dashboard-section-title">Songs to Hear</h2>
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

                    <h2 className="dashboard-section-title">Recommended Gangs</h2>
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

        // 3. Profile & Settings View
        if (activeTab === 'profile') {
            return (
                <div className="settings-container">
                    {activeChannel === 'account' && (
                        <div className="settings-section glass-panel">
                            <div className="settings-header">
                                <h3 className="settings-title">My Account</h3>
                                <p className="settings-subtitle">Manage your personal information and security.</p>
                            </div>
                            
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Profile Picture</h4>
                                    <p>Update your avatar</p>
                                </div>
                                <div className="avatar-large">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                            </div>
                            
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Username</h4>
                                    <p>{user?.username || 'User123'}</p>
                                </div>
                                <button className="btn-secondary">Edit</button>
                            </div>
                            
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Email Address</h4>
                                    <p>{user?.email || 'user@hangova.com'}</p>
                                </div>
                                <button className="btn-secondary">Edit</button>
                            </div>
                            
                            <div className="setting-row danger-zone">
                                <div className="setting-info">
                                    <h4>Danger Zone</h4>
                                    <p>Permanently delete your account and all data.</p>
                                </div>
                                <button className="btn-danger">Delete Account</button>
                            </div>
                        </div>
                    )}

                    {activeChannel === 'appearance' && (
                        <div className="settings-section">
                            <div className="settings-header">
                                <h3 className="settings-title">Appearance</h3>
                                <p className="settings-subtitle">Customize how Hangova looks on your device.</p>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Theme</h4>
                                    <p>Select your preferred color scheme</p>
                                </div>
                                <select 
                                    className="settings-select"
                                    value={settings.theme}
                                    onChange={(e) => setSettings({...settings, theme: e.target.value})}
                                >
                                    <option value="dark">Hangova Dark</option>
                                    <option value="cyberpunk">Neon Cyberpunk</option>
                                    <option value="midnight">Midnight Blue</option>
                                </select>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>UI Glow Intensity</h4>
                                    <p>Adjust the neon bloom effects</p>
                                </div>
                                <input 
                                    type="range" 
                                    className="settings-range" 
                                    min="0" max="100" 
                                    value={settings.glowIntensity}
                                    onChange={(e) => setSettings({...settings, glowIntensity: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                    )}

                    {activeChannel === 'notifications' && (
                        <div className="settings-section">
                            <div className="settings-header">
                                <h3 className="settings-title">Notifications</h3>
                                <p className="settings-subtitle">Control when and how you are alerted.</p>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Push Notifications</h4>
                                    <p>Receive alerts for messages and invites</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.pushNotifications}
                                        onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Email Alerts</h4>
                                    <p>Receive daily summaries via email</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.emailAlerts}
                                        onChange={(e) => setSettings({...settings, emailAlerts: e.target.checked})}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeChannel === 'privacy' && (
                        <div className="settings-section">
                            <div className="settings-header">
                                <h3 className="settings-title">Privacy & Safety</h3>
                                <p className="settings-subtitle">Manage who can see your activity.</p>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Online Status</h4>
                                    <p>Let friends know when you're active</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.onlineStatus}
                                        onChange={(e) => setSettings({...settings, onlineStatus: e.target.checked})}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="setting-row">
                                <div className="setting-info">
                                    <h4>Read Receipts</h4>
                                    <p>Show others when you've read their messages</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.readReceipts}
                                        onChange={(e) => setSettings({...settings, readReceipts: e.target.checked})}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // 4. Default Chat/Room View
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
                        <button className="attach-btn"><Plus size={20} /></button>
                        <input type="text" placeholder={`Message in ${activeChannel}...`} className="message-input" />
                        <button className="emoji-btn"><Smile size={20} /></button>
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
            return <AuthPage onLogin={(userData) => { setUser(userData); setIsLoggedIn(true); setShowAuth(false); }} onBack={() => setShowAuth(false)} />;
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
                ><Home size={24} /></div>
                <div className="server-separator"></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'movies' ? 'active' : ''}`} 
                    data-tooltip="Movies"
                    onClick={() => handleTabSwitch("movies", "movie-room")}
                ><Film size={24} /></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'music' ? 'active' : ''}`} 
                    data-tooltip="Music"
                    onClick={() => handleTabSwitch("music", "music-general")}
                ><Music size={24} /></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'reels' ? 'active' : ''}`} 
                    data-tooltip="Reels"
                    onClick={() => handleTabSwitch("reels", "reels-foryou")}
                ><Smartphone size={24} /></div>
                <div className="server-separator"></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'dms' ? 'active' : ''}`} 
                    data-tooltip="DMs & Groups"
                    onClick={() => handleTabSwitch("dms", "admin")}
                ><MessageCircle size={24} /></div>
                <div 
                    className={`server-icon gang-icon tooltip ${activeTab === 'profile' ? 'active' : ''}`} 
                    data-tooltip="Profile"
                    onClick={() => handleTabSwitch("profile", "account")}
                ><User size={24} /></div>
                
                {/* Logout Button */}
                <div style={{ marginTop: 'auto', marginBottom: '16px' }}>
                    <div 
                        className="server-icon gang-icon tooltip" 
                        data-tooltip="Log Out"
                        onClick={() => setIsLoggedIn(false)}
                        style={{ border: '1px dashed #ef4444', color: '#ef4444' }}
                    ><LogOut size={24} />
                    </div>
                </div>
            </nav>

            {/* Contextual Inner Sidebar */}
            <aside className="channels-sidebar">
                <div className="sidebar-scrollable-content" style={{flex: 1, overflowY: 'auto'}}>
                    {renderInnerSidebar()}
                </div>

                <div className="user-profile">
                    <div className="avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="user-details">
                        <span className="username">{user?.username || 'User123'}</span>
                        <span className="status">Online</span>
                    </div>
                    <div className="profile-actions"><Settings size={18} /></div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content" style={{ padding: activeTab === 'reels' ? 0 : undefined }}>
                {activeTab !== 'reels' && (
                    <header className="main-header">
                        <div className="header-title">
                            <span className="channel-icon">{activeTab === "dms" && activeChannel === "admin" ? <Film size={24} /> : <MessageCircle size={24} />}</span> 
                            {activeTab === 'home' && activeChannel === 'home-dash' ? 'Discovery' : activeChannel}
                        </div>
                        <div className="header-actions">
                            <button className="action-btn"><Search size={20} /></button>
                            <button className="action-btn"><Bell size={20} /></button>
                            <button className="action-btn"><Users size={20} /></button>
                        </div>
                    </header>
                )}
                
                {renderMainContent()}

            </main>
        </div>
    );
}
