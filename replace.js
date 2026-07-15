const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

if (!code.includes('lucide-react')) {
  code = code.replace(
    'import AuthPage from "./components/AuthPage";',
    'import AuthPage from "./components/AuthPage";\nimport { Home, Film, Music, Smartphone, MessageCircle, User, LogOut, Star, Flame, Hash, MonitorPlay, Settings, Palette, Bell, Lock, Search, Users, Plus, Smile } from "lucide-react";'
  );
}

code = code.replace(/>H<\/div>/g, '><Home size={24} /></div>');
code = code.replace(/>🎬<\/div>/g, '><Film size={24} /></div>');
code = code.replace(/>🎵<\/div>/g, '><Music size={24} /></div>');
code = code.replace(/>📱<\/div>/g, '><Smartphone size={24} /></div>');
code = code.replace(/>💬<\/div>/g, '><MessageCircle size={24} /></div>');
code = code.replace(/>👤<\/div>/g, '><User size={24} /></div>');
code = code.replace(/>\s*🚪\s*<\/div>/g, '><LogOut size={24} />\n                    </div>');

code = code.replace(/<span className="channel-icon">🌟<\/span>/g, '<span className="channel-icon"><Star size={18} /></span>');
code = code.replace(/<span className="channel-icon">🔥<\/span>/g, '<span className="channel-icon"><Flame size={18} /></span>');
code = code.replace(/<span className="channel-icon">#<\/span>/g, '<span className="channel-icon"><Hash size={18} /></span>');
code = code.replace(/<span className="channel-icon">🛋️<\/span>/g, '<span className="channel-icon"><MonitorPlay size={18} /></span>');
code = code.replace(/<span className="channel-icon">🍿<\/span>/g, '<span className="channel-icon"><MonitorPlay size={18} /></span>');
code = code.replace(/<span className="channel-icon">👥<\/span>/g, '<span className="channel-icon"><Users size={18} /></span>');

code = code.replace(/<span className="channel-icon">👤<\/span>/g, '<span className="channel-icon"><User size={18} /></span>');
code = code.replace(/<span className="channel-icon">🎨<\/span>/g, '<span className="channel-icon"><Palette size={18} /></span>');
code = code.replace(/<span className="channel-icon">🔔<\/span>/g, '<span className="channel-icon"><Bell size={18} /></span>');
code = code.replace(/<span className="channel-icon">🔒<\/span>/g, '<span className="channel-icon"><Lock size={18} /></span>');

code = code.replace(/<span className="channel-icon">\{activeTab === 'dms' && activeChannel === 'admin' \? '🎬' : '💬'\}<\/span>/g, '<span className="channel-icon">{activeTab === "dms" && activeChannel === "admin" ? <Film size={24} /> : <MessageCircle size={24} />}</span>');
code = code.replace(/<button className="action-btn">🔍<\/button>/g, '<button className="action-btn"><Search size={20} /></button>');
code = code.replace(/<button className="action-btn">🔔<\/button>/g, '<button className="action-btn"><Bell size={20} /></button>');
code = code.replace(/<button className="action-btn">👥<\/button>/g, '<button className="action-btn"><Users size={20} /></button>');

code = code.replace(/<button className="attach-btn">\+<\/button>/g, '<button className="attach-btn"><Plus size={20} /></button>');
code = code.replace(/<button className="emoji-btn">😀<\/button>/g, '<button className="emoji-btn"><Smile size={20} /></button>');

code = code.replace(/🎬 Admin&apos;s Top Movie Picks/g, 'Admin&apos;s Top Movie Picks');
code = code.replace(/🎵 Songs to Hear/g, 'Songs to Hear');
code = code.replace(/👥 Recommended Gangs/g, 'Recommended Gangs');

fs.writeFileSync('app/page.tsx', code);
console.log("Done");
