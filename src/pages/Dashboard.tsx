import { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { LanguageContext, Logo, ToastContext, AuthContext } from '../App';
import { 
  MessageCircle, Tag, Palette, FileText, Trash2,
  ShieldAlert, UserX, CheckCircle, EyeOff, Users, BarChart3, TrendingUp, Activity,
  Award, MessageSquare, Heart, Image as ImageIcon, Grid, Calendar
} from 'lucide-react';
import '../App.css';

// --- MEDIA MAPPING ---
const allMediaFiles = import.meta.glob('../../public/Storage/**/*.{mp4,jpg,jpeg,png}', { eager: true });
const mediaMap: Record<string, string> = {};
Object.entries(allMediaFiles).forEach(([path, module]: [string, any]) => {
  const fileName = path.split('/').pop() || '';
  const parts = path.split('/');
  const category = parts[parts.length - 2]?.toLowerCase() || 'general';
  const id = `${category}-${fileName.replace(/\s+/g, '-').toLowerCase()}`;
  const rawUrl = typeof module === 'string' ? module : (module.default || '');
  mediaMap[id] = String(rawUrl).replace('/public', '').replace('../../public', '');
});

function Dashboard() {
  const { t, lang } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const { user, bannedUsers, banUser, unbanUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'social' | 'content' | 'theme' | 'security'>('analytics');
  
  // Power BI Style Filters (Multi-Select)
  const [analyticsCategories, setAnalyticsCategories] = useState<string[]>(['All']);
  const [cmsCategory, setCmsCategory] = useState('All');

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setAnalyticsCategories(['All']);
    } else {
      let newCats = analyticsCategories.filter(c => c !== 'All');
      if (newCats.includes(cat)) {
        newCats = newCats.filter(c => c !== cat);
        if (newCats.length === 0) newCats = ['All'];
      } else {
        newCats = [...newCats, cat];
      }
      setAnalyticsCategories(newCats);
    }
  };

  // Drag & Drop State for Custom Charts
  const [customChart, setCustomChart] = useState({ x: 'date', y: 'engagement', z: 'none' });

  const handleDragStartCustom = (e: React.DragEvent, type: 'metric' | 'dimension', value: string) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('value', value);
  };

  const handleDropCustom = (e: React.DragEvent, axis: 'x' | 'y' | 'z') => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const value = e.dataTransfer.getData('value');
    
    if (axis === 'y' && type !== 'metric') { addToast('Axa Y acceptă doar Metrici (Cantități)!', 'error'); return; }
    if ((axis === 'x' || axis === 'z') && type !== 'dimension' && value !== 'none') { addToast(`Axa ${axis.toUpperCase()} acceptă doar Dimensiuni de grupare!`, 'error'); return; }

    setCustomChart(prev => ({ ...prev, [axis]: value }));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, navigate]);

  const [socialData, setSocialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem('ltd_custom_theme');
    return saved ? JSON.parse(saved) : { 
      primary: '#9b1c1c', 
      secondary: '#e6e6e6',
      bgDark: '#0f0f11', 
      bgCard: '#1a1a1e', 
      textMain: '#f8fafc', 
      textMuted: '#94a3b8',
      btnRadius: 10, 
      cardRadius: 16 
    };
  });

  const [editingTexts, setEditingTexts] = useState<any>(() => {
    const saved = localStorage.getItem(`ltd_texts_override_${lang}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Generator Date de Test Complexe (3 ani, mii de interacțiuni)
  const injectMockData = () => {
    const mockData = {
      "salsa-incepatori-1": { likes: 145, likedBy: ['Andrei P.', 'Mihai C.', 'Elena M.'], comments: [{user: "Andrei P.", text: "Prima mea lectie", date: "15 Ianuarie 2024 18:00"}, {user: "Mihai C.", text: "Foarte greu la inceput", date: "10 Februarie 2024 19:00"}], tags: ['salsa', 'incepatori'] },
      "salsa-avansati-2": { likes: 320, likedBy: ['Cristina D.', 'Ionut B.'], comments: [{user: "Elena M.", text: "Coregrafie superba!", date: "05 Martie 2024 20:00"}], tags: ['salsa', 'avansati', 'show'] },
      "bachata-senzual-1": { likes: 512, likedBy: ['Andrei P.', 'Sorin G.'], comments: [{user: "Cristina D.", text: "Vreau sa invat asta", date: "12 Aprilie 2024 10:00"}, {user: "SpamBot", text: "Link aici", date: "13 Aprilie 2024 11:00"}], tags: ['bachata', 'senzual'] },
      "bachata-footwork": { likes: 210, likedBy: [], comments: [{user: "Andrei P.", text: "Ce viteza!", date: "20 Mai 2024 15:00"}], tags: ['bachata', 'footwork'] },
      "kizomba-conexiune": { likes: 180, likedBy: ['Mihai C.'], comments: [{user: "Mihai C.", text: "Relaxant", date: "15 Iunie 2024 21:00"}], tags: ['kizomba'] },
      "kizomba-musicality": { likes: 290, likedBy: ['Elena M.', 'Cristina D.'], comments: [{user: "Elena M.", text: "Auzi fiecare beat", date: "10 Iulie 2024 14:00"}], tags: ['kizomba', 'avansati'] },
      "salsa-party-vara": { likes: 650, likedBy: ['Andrei P.', 'Mihai C.', 'Elena M.', 'Cristina D.'], comments: [{user: "Cristina D.", text: "Cea mai tare petrecere!", date: "25 August 2024 23:00"}], tags: ['salsa', 'party'] },
      "bachata-party-toamna": { likes: 420, likedBy: ['Sorin G.'], comments: [{user: "Andrei P.", text: "Revenim!", date: "10 Octombrie 2024 22:00"}], tags: ['bachata', 'party'] },
      "salsa-tehnica-spins": { likes: 110, likedBy: [], comments: [{user: "Mihai C.", text: "Imi pierd echilibrul", date: "05 Noiembrie 2024 18:00"}], tags: ['salsa', 'tehnica'] },
      "bachata-izolari": { likes: 340, likedBy: ['Ionut B.'], comments: [{user: "Elena M.", text: "Greu dar merita", date: "12 Decembrie 2024 19:00"}], tags: ['bachata', 'tehnica'] },
      "kizomba-urban": { likes: 275, likedBy: ['Andrei P.'], comments: [{user: "Cristina D.", text: "Wow, alt stil", date: "20 Ianuarie 2025 20:00"}], tags: ['kizomba', 'urban'] },
      "salsa-festival": { likes: 890, likedBy: ['Mihai C.', 'Elena M.', 'Cristina D.'], comments: [{user: "Andrei P.", text: "Incredibil", date: "15 Februarie 2025 21:00"}, {user: "Elena M.", text: "La anul vin si eu", date: "16 Februarie 2025 10:00"}], tags: ['salsa', 'festival'] },
      "bachata-masterclass": { likes: 460, likedBy: ['Sorin G.'], comments: [{user: "Mihai C.", text: "Notite luate", date: "10 Martie 2025 14:00"}], tags: ['bachata', 'masterclass'] },
      "salsa-rueda": { likes: 310, likedBy: ['Andrei P.', 'Ionut B.'], comments: [{user: "Cristina D.", text: "Dile que no!", date: "05 Aprilie 2025 19:00"}], tags: ['salsa', 'rueda'] },
      "kizomba-tarraxinha": { likes: 220, likedBy: ['Mihai C.'], comments: [{user: "Elena M.", text: "Interesant", date: "20 Mai 2025 20:00"}], tags: ['kizomba', 'tehnica'] },
      "salsa-shines-fete": { likes: 540, likedBy: ['Elena M.', 'Cristina D.'], comments: [{user: "Cristina D.", text: "Fetelor, sunteti top", date: "15 Iunie 2025 18:00"}], tags: ['salsa', 'shines'] },
      "bachata-lady-styling": { likes: 610, likedBy: ['Andrei P.'], comments: [{user: "Elena M.", text: "Eleganta pura", date: "10 Iulie 2025 19:00"}], tags: ['bachata', 'styling'] },
      "salsa-concurs": { likes: 1200, likedBy: ['Mihai C.', 'Ionut B.', 'Sorin G.'], comments: [{user: "Andrei P.", text: "Felicitari campionilor!", date: "25 August 2025 22:00"}, {user: "Mihai C.", text: "Bravooo", date: "26 August 2025 09:00"}], tags: ['salsa', 'concurs'] },
      "bachata-social": { likes: 380, likedBy: ['Elena M.'], comments: [{user: "Cristina D.", text: "Ce melodie e?", date: "10 Septembrie 2025 21:00"}], tags: ['bachata', 'social'] },
      "kizomba-demo": { likes: 450, likedBy: ['Cristina D.'], comments: [{user: "Elena M.", text: "Perfect", date: "05 Octombrie 2025 20:00"}], tags: ['kizomba', 'show'] },
      "salsa-halloween": { likes: 590, likedBy: ['Andrei P.', 'Mihai C.'], comments: [{user: "Andrei P.", text: "Ce costume!", date: "31 Octombrie 2025 23:00"}], tags: ['salsa', 'party', 'halloween'] },
      "bachata-craciun": { likes: 720, likedBy: ['Ionut B.', 'Sorin G.'], comments: [{user: "Mihai C.", text: "Sarbatori fericite!", date: "24 Decembrie 2025 20:00"}], tags: ['bachata', 'party', 'craciun'] },
      "salsa-anul-nou": { likes: 850, likedBy: ['Elena M.'], comments: [{user: "Cristina D.", text: "La multi ani 2026!", date: "01 Ianuarie 2026 01:00"}], tags: ['salsa', 'party', 'revelion'] },
      "bachata-valentines": { likes: 930, likedBy: ['Andrei P.', 'Cristina D.'], comments: [{user: "Elena M.", text: "Romantic", date: "14 Februarie 2026 21:00"}], tags: ['bachata', 'party', 'valentines'] },
      "kizomba-martie": { likes: 410, likedBy: ['Mihai C.'], comments: [{user: "Andrei P.", text: "Primavara in pasi de dans", date: "01 Martie 2026 18:00"}], tags: ['kizomba', 'social'] }
    };
    setSocialData(mockData);
    localStorage.setItem('ltd_social_data', JSON.stringify(mockData));
    addToast('Date masive de test generate!', 'success');
  };

  // --- ANALYTICS ENGINE (Static + Dynamic Builder) ---
  const analytics = useMemo(() => {
    const dataArray = Object.entries(socialData);
    let totalLikes = 0;
    let totalComments = 0;
    const mediaEngagement: any[] = [];
    const tagStats: Record<string, number> = {};

    dataArray.forEach(([id, data]: [string, any]) => {
      if (!analyticsCategories.includes('All') && !analyticsCategories.some(cat => id.startsWith(cat.toLowerCase()))) return;

      const likes = data.likes || 0;
      const comments = (data.comments || []);
      const currentEngagement = likes + (comments.length * 3);
      totalLikes += likes;
      totalComments += comments.length;
      
      mediaEngagement.push({ id, url: mediaMap[id] || '', likes, comments: comments.length, score: currentEngagement, isHidden: (data.tags || []).includes('hidden') });

      (data.tags || []).forEach((tag: string) => {
        if (tag !== 'hidden') tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    });

    return {
      totalLikes, totalComments, totalMedia: mediaEngagement.length,
      topMedia: [...mediaEngagement].sort((a, b) => b.score - a.score).slice(0, 5),
      popularTags: Object.entries(tagStats).sort((a, b) => b[1] - a[1]).slice(0, 8)
    };
  }, [socialData, analyticsCategories]);

  // CUSTOM CHART DATA GENERATOR (POWER BI PIVOT ENGINE)
  const getCustomChartData = (xAxis: string, yAxis: string, legendAxis: string) => {
    const grouped: Record<string, Record<string, number>> = {};
    const legendKeys = new Set<string>();
    
    Object.entries(socialData).forEach(([id, data]: [string, any]) => {
      // 1. Filtrul global
      if (!analyticsCategories.includes('All') && !analyticsCategories.some(cat => id.startsWith(cat.toLowerCase()))) return;

      // 2. Extragere atribute brute
      const category = id.split('-')[0];
      const likes = data.likes || 0;
      const commentsArr = data.comments || [];
      const commentsCount = commentsArr.length;
      const engagement = likes + (commentsCount * 3);
      const tags = data.tags || [];

      // 3. Valoarea cantitativă pentru Axa Y
      let yValue = 0;
      if (yAxis === 'likes') yValue = likes;
      if (yAxis === 'comments') yValue = commentsCount;
      if (yAxis === 'engagement') yValue = engagement;

      if (yValue === 0) return;

      // 4. Extragere Timeline
      const timePoints: string[] = [];
      if (commentsArr.length > 0) {
         commentsArr.forEach((c: any) => {
            const parts = c.date.split(' ');
            if (parts.length >= 3) {
               timePoints.push(`${parts[1].slice(0,3)} ${parts[2].slice(-2)}`);
            }
         });
      } else {
         timePoints.push('Trecut');
      }

      // 5. Generator generic de axe
      const getAxisValues = (axisType: string): string[] => {
         if (axisType === 'none') return ['Total'];
         if (axisType === 'category') return [category];
         if (axisType === 'tags') return tags.length > 0 ? tags.filter((t:any) => t !== 'hidden') : ['Fara Tag'];
         if (axisType === 'date') return timePoints.length > 0 ? Array.from(new Set(timePoints)) : ['Trecut'];
         return ['Necunoscut'];
      };

      const xValues = getAxisValues(xAxis);
      const zValues = getAxisValues(legendAxis);

      // 6. Agregarea în matrice (Împărțim valoarea pe axa timpului dacă e cazul)
      // Dacă axa implică timp, distribuim valoarea (ex: 100 likes pe 2 luni = 50 pe lună)
      // Dacă axa implică tag-uri, postarea se reflectă întreg în fiecare tag.
      let weight = 1;
      if (xAxis === 'date' || legendAxis === 'date') {
         weight = timePoints.length || 1;
      }

      xValues.forEach(xVal => {
         zValues.forEach(zVal => {
            const distributedValue = yValue / weight;
            if (!grouped[xVal]) grouped[xVal] = {};
            grouped[xVal][zVal] = (grouped[xVal][zVal] || 0) + distributedValue;
            legendKeys.add(zVal);
         });
      });
    });

    // 7. Formatare pentru Recharts
    let result = Object.entries(grouped).map(([name, zVals]) => {
       const row: any = { name };
       Object.entries(zVals).forEach(([k, v]) => { row[k] = Math.round(v); });
       return row;
    });

    // 8. Sortare
    if (xAxis === 'date') {
       const monthsOrder: Record<string, number> = { 'Ian':1, 'Feb':2, 'Mar':3, 'Apr':4, 'Mai':5, 'Iun':6, 'Iul':7, 'Aug':8, 'Sep':9, 'Oct':10, 'Noi':11, 'Dec':12, 'Jan':1, 'May':5, 'Jun':6, 'Jul':7 };
       result.sort((a, b) => {
          const [mA, yA] = a.name.split(' ');
          const [mB, yB] = b.name.split(' ');
          if (yA !== yB) return Number(yA) - Number(yB);
          return (monthsOrder[mA] || 0) - (monthsOrder[mB] || 0);
       });
    } else {
       result.sort((a, b) => {
          const sumA = Object.keys(a).filter(k=>k!=='name').reduce((acc, k)=>acc+a[k], 0);
          const sumB = Object.keys(b).filter(k=>k!=='name').reduce((acc, k)=>acc+b[k], 0);
          return sumB - sumA;
       });
       if (xAxis === 'tags') result = result.slice(0, 10);
    }
    
    return { data: result, keys: Array.from(legendKeys) };
  };

  const customDataObj = useMemo(() => getCustomChartData(customChart.x, customChart.y, customChart.z), [socialData, customChart, analyticsCategories]);
  const customData = customDataObj.data;
  const customKeys = customDataObj.keys;
  const chartColors = ['var(--primary)', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];


  // Users
  const userStats = useMemo(() => {
    const directory: Record<string, any> = {};
    Object.entries(socialData).forEach(([mediaId, data]: [string, any]) => {
      (data.comments || []).forEach((c: any) => {
        if (!directory[c.user]) directory[c.user] = { name: c.user, commentCount: 0, likeCount: 0, firstActive: c.date, lastActive: c.date, mediaList: new Set() };
        directory[c.user].commentCount += 1;
        directory[c.user].lastActive = c.date;
        directory[c.user].mediaList.add(mediaId);
      });
      (data.likedBy || []).forEach((uId: string) => {
        if (uId === 'guest-session') return;
        if (!directory[uId]) directory[uId] = { name: uId, commentCount: 0, likeCount: 0, firstActive: 'N/A', lastActive: 'N/A', mediaList: new Set() };
        directory[uId].likeCount += 1;
        directory[uId].mediaList.add(mediaId);
      });
    });
    return Object.values(directory).sort((a: any, b: any) => (b.commentCount + b.likeCount) - (a.commentCount + a.likeCount));
  }, [socialData]);

  // Handlers
  const deleteComment = (mediaId: string, idx: number) => {
    const newData = { ...socialData };
    newData[mediaId].comments.splice(idx, 1);
    setSocialData({ ...newData });
    localStorage.setItem('ltd_social_data', JSON.stringify(newData));
  };

  const toggleVisibility = (id: string) => {
    const newData = { ...socialData };
    const tags = newData[id]?.tags || [];
    newData[id] = { ...newData[id], tags: tags.includes('hidden') ? tags.filter((t:any) => t !== 'hidden') : [...tags, 'hidden'] };
    setSocialData({ ...newData });
    localStorage.setItem('ltd_social_data', JSON.stringify(newData));
  };

  const updateTheme = (key: string, value: string | number) => {
    const newConfig = { ...themeConfig, [key]: value };
    setThemeConfig(newConfig);
    localStorage.setItem('ltd_custom_theme', JSON.stringify(newConfig));
    const root = document.documentElement;
    const cssKey = key === 'btnRadius' ? '--radius-btn' : key === 'cardRadius' ? '--radius-card' : `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssKey, typeof value === 'number' ? `${value}px` : value);
  };

  const resetTheme = () => {
    localStorage.removeItem('ltd_custom_theme');
    const defaultConfig = { 
      primary: '#9b1c1c', 
      secondary: '#e6e6e6',
      bgDark: '#0f0f11', 
      bgCard: '#1a1a1e', 
      textMain: '#f8fafc', 
      textMuted: '#94a3b8',
      btnRadius: 10, 
      cardRadius: 16 
    };
    setThemeConfig(defaultConfig);
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--bg-dark');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--text-main');
    root.style.removeProperty('--text-muted');
    root.style.removeProperty('--radius-btn');
    root.style.removeProperty('--radius-card');
    addToast('Tema a fost resetată cu succes!', 'success');
  };

  const saveText = (section: string, key: string, value: string) => {
    const newOverrides = { ...editingTexts };
    if (!newOverrides[section]) newOverrides[section] = {};
    newOverrides[section][key] = value;
    setEditingTexts(newOverrides);
    localStorage.setItem(`ltd_texts_override_${lang}`, JSON.stringify(newOverrides));
    addToast('Salvat!', 'success');
  };

  const axisLabels: any = { likes: 'Aprecieri', comments: 'Comentarii', engagement: 'Engagement Total', date: 'Cronologic (Luni/Ani)', category: 'Stil Dans', tags: 'Tag-uri Mixte' };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dashboard-container" style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ width: '250px', position: 'sticky', top: '100px', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'left' }}><Logo size={40} /></div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '1.5rem' }}>
            <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={18}/>} label="Analytics BI" />
            <NavBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18}/>} label="Community" />
            <NavBtn active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<MessageCircle size={18}/>} label="Moderation" />
            <NavBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<FileText size={18}/>} label="CMS Texts" />
            <NavBtn active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} icon={<Palette size={18}/>} label="Branding" />
            <NavBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<ShieldAlert size={18}/>} label="Security" />
          </nav>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            
            {/* 1. ANALYTICS (POWER BI EDITION) */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <SectionHeader title="Performance BI" subtitle="Insight-uri vizuale despre impactul site-ului." />
                  
                  {/* Global Filters & Mock Data */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end' }}>
                    <button onClick={injectMockData} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', alignSelf: 'flex-end', marginBottom: '0.5rem' }}>Generare Date Test Masive</button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      {/* Buton "Toate Categoriile" - Rândul de sus */}
                      <button 
                        onClick={() => toggleCategory('All')}
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '20px',
                          border: analyticsCategories.includes('All') ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                          background: analyticsCategories.includes('All') ? 'var(--primary)' : 'var(--bg-card)',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s',
                          width: 'fit-content'
                        }}
                      >
                        <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: analyticsCategories.includes('All') ? '#fff' : 'transparent' }}>
                          {analyticsCategories.includes('All') && <CheckCircle size={10} color="var(--primary)" strokeWidth={3} />}
                        </div>
                        Toate Categoriile
                      </button>

                      {/* Celelalte 3 butoane - Rândul de jos */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['salsa', 'bachata', 'kizomba'].map(cat => {
                          const isSelected = analyticsCategories.includes(cat);
                          return (
                            <button 
                              key={cat}
                              onClick={() => toggleCategory(cat)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                borderRadius: '20px',
                                border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                              }}
                            >
                              <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? '#fff' : 'transparent' }}>
                                {isSelected && <CheckCircle size={10} color="var(--primary)" strokeWidth={3} />}
                              </div>
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <StatCard icon={<Heart color="#ff4444"/>} label="Total Likes" value={analytics.totalLikes} color="#ff4444" />
                  <StatCard icon={<MessageSquare color="var(--primary)"/>} label="Total Comments" value={analytics.totalComments} color="var(--primary)" />
                  <StatCard icon={<TrendingUp color="#10b981"/>} label="Engagement Total" value={analytics.totalMedia > 0 ? (analytics.totalLikes + analytics.totalComments * 3) : 0} color="#10b981" />
                  <StatCard icon={<Activity color="#3b82f6"/>} label="Media count" value={analytics.totalMedia} color="#3b82f6" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {/* Ranked List with Images */}
                  <div className="feature-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={20} color="gold"/> Top 5 Cel mai de succes conținut</h3>
                    <div className="dash-scroll-container" style={{ maxHeight: '300px' }}>
                      {analytics.topMedia.map((m, i) => (
                        <div key={m.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontWeight: 900, opacity: 0.2, width: '25px' }}>{i+1}</span>
                          <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                            {m.url ? (
                              m.url.endsWith('.mp4') ? <video src={m.url + '#t=0.5'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted /> : <img src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}><ImageIcon size={20}/></div>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{m.id}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{m.likes} ❤️ | {m.comments} 💬</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>{m.score}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="feature-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}><Tag size={20} /> HashTag-uri Căutate</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                      {analytics.popularTags.map(([tag, count]: any) => (
                        <div key={tag} className="tag-pill" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                          #{tag} <strong style={{ marginLeft: '0.8rem', color: '#fff' }}>{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '2.5rem', marginBottom: '2rem' }}>
                  <SectionHeader title="Generator de Rapoarte (Power BI Mode)" subtitle="Trage metricile și dimensiunile în zonele graficelor pentru a analiza." />
                </div>

                {/* DRAG AND DROP METRICS POOL (INPUT AREA) */}
                <div className="feature-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    
                    {/* Y Axis Pool (Vertical) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '200px' }}>
                       <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#3b82f6', marginBottom: '0.5rem' }}>Metrici (Axa Y)</div>
                       <div draggable onDragStart={(e) => handleDragStartCustom(e, 'metric', 'comments')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={14} color="var(--primary)"/> Comentarii</div>
                       <div draggable onDragStart={(e) => handleDragStartCustom(e, 'metric', 'likes')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={14} color="#ff4444"/> Aprecieri</div>
                       <div draggable onDragStart={(e) => handleDragStartCustom(e, 'metric', 'engagement')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={14} color="#10b981"/> Engagement</div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {/* Dropzones (Center - Layout similar unui grafic real) */}
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px dashed var(--border)', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Configurează Raportul (Trage Aici)</div>
                          <button onClick={() => setCustomChart({ x: 'date', y: 'engagement', z: 'none' })} style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>RESET</button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gridTemplateRows: '1fr 80px', gap: '1rem', flex: 1, minHeight: '250px' }}>
                          
                          {/* Y Axis (Stânga - Vertical) */}
                          <div 
                            onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropCustom(e, 'y')}
                            style={{ gridColumn: '1 / 2', gridRow: '1 / 2', border: '2px dashed #3b82f6', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s', padding: '0.5rem', textAlign: 'center' }}
                          >
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.5rem' }}>AXA Y</div>
                            <strong style={{ color: '#3b82f6', fontSize: '0.9rem' }}>{axisLabels[customChart.y]}</strong>
                          </div>

                          {/* Z Axis / Legend (Centru/Dreapta - Spațiul Principal) */}
                          <div 
                            onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropCustom(e, 'z')}
                            style={{ gridColumn: '2 / 3', gridRow: '1 / 2', border: '2px dashed #f59e0b', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                          >
                            <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>{axisLabels[customChart.z]}</strong>
                          </div>

                          {/* X Axis (Jos - Orizontal, pe lățimea axei Z) */}
                          <div 
                            onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropCustom(e, 'x')}
                            style={{ gridColumn: '2 / 3', gridRow: '2 / 3', border: '2px dashed #10b981', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', transition: '0.2s' }}
                          >
                            AXA X (Bază): <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{axisLabels[customChart.x]}</strong>
                          </div>

                        </div>
                      </div>

                      {/* X Axis Pool (Horizontal) */}
                      <div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', marginBottom: '0.8rem' }}>Dimensiuni (Pentru Axa X sau Z)</div>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <div draggable onDragStart={(e) => handleDragStartCustom(e, 'dimension', 'date')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}><Calendar size={14} color="#10b981"/> Timeline</div>
                           <div draggable onDragStart={(e) => handleDragStartCustom(e, 'dimension', 'category')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}><Grid size={14} color="#10b981"/> Stiluri Dans</div>
                           <div draggable onDragStart={(e) => handleDragStartCustom(e, 'dimension', 'tags')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}><Tag size={14} color="#10b981"/> Tag-uri</div>
                           <div draggable onDragStart={(e) => handleDragStartCustom(e, 'dimension', 'none')} className="drag-pill" style={{ cursor: 'grab', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, border: '1px dashed #f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', color: '#f59e0b' }}> Fără Grupare (Z)</div>
                         </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* OUTPUT AREA (CHARTS) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  
                  {/* CHART 1: LINE CHART */}
                  <div className="feature-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', textAlign: 'center', opacity: 0.8 }}>
                      Evoluție Liniară: <span style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{axisLabels[customChart.y]}</span> pe <span style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{axisLabels[customChart.x]}</span> {customChart.z !== 'none' && <> segmentat pe <span style={{ color: '#f59e0b', textTransform: 'uppercase' }}>{axisLabels[customChart.z]}</span></>}
                    </h3>
                    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={300}>
                        <AreaChart data={customData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <RechartsTooltip contentStyle={{ background: '#1a1a1e', border: '1px solid #333', borderRadius: '10px', textTransform: 'capitalize' }} />
                          {customKeys.map((key, i) => (
                            <Area key={key} type="monotone" dataKey={key} stackId={customChart.z !== 'none' ? "1" : undefined} stroke={chartColors[i % chartColors.length]} fill={chartColors[i % chartColors.length]} fillOpacity={0.6} strokeWidth={2} />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* CHART 2: BAR CHART */}
                  <div className="feature-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', textAlign: 'center', opacity: 0.8 }}>
                      Distribuție pe Bare: <span style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{axisLabels[customChart.y]}</span> pe <span style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{axisLabels[customChart.x]}</span> {customChart.z !== 'none' && <> segmentat pe <span style={{ color: '#f59e0b', textTransform: 'uppercase' }}>{axisLabels[customChart.z]}</span></>}
                    </h3>
                    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={300}>
                        <BarChart data={customData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <RechartsTooltip contentStyle={{ background: '#1a1a1e', border: '1px solid #333', borderRadius: '10px', textTransform: 'capitalize' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                          {customKeys.map((key, i) => (
                            <Bar key={key} dataKey={key} stackId={customChart.z !== 'none' ? "a" : undefined} fill={chartColors[i % chartColors.length]} radius={customChart.z !== 'none' ? [0,0,0,0] : [4,4,0,0]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* 2. COMMUNITY EXPLORER */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader title="Community Explorer" subtitle="Gestionarea profilurilor care interacționează." />
                <div className="dash-scroll-container">
                  {userStats.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5, border: '1px dashed var(--border)', borderRadius: '16px' }}>
                      <Users size={40} style={{ marginBottom: '1rem' }} />
                      <p>Comunitatea este momentan liniștită.<br/>Utilizatorii care comentează vor fi listați automat aici.</p>
                      <button onClick={injectMockData} className="btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>Populează cu Date de Test</button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      {userStats.map((u: any) => (
                        <div key={u.name} className="feature-card" style={{ padding: '1.5rem', border: bannedUsers.includes(u.name) ? '1px solid #ff4444' : '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div className="user-avatar-mini" style={{ width: '50px', height: '50px', fontSize: '1.2rem', background: '#334155' }}>{u.name.charAt(0)}</div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: 0, fontSize: '1rem' }}>{u.name}</h3>
                              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Activ: {u.lastActive}</div>
                            </div>
                            {bannedUsers.includes(u.name) ? (
                              <button onClick={() => unbanUser(u.name)} className="btn-send-animated" style={{ background: '#10b981' }}><CheckCircle size={16}/></button>
                            ) : (
                              <button onClick={() => { banUser(u.name); addToast(`${u.name} blocat!`, 'error'); }} className="btn-send-animated" style={{ background: '#ff4444' }}><UserX size={16}/></button>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '10px' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>COMENTARII</div>
                              <div style={{ fontWeight: 900 }}>{u.commentCount}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>LIKE-URI</div>
                              <div style={{ fontWeight: 900 }}>{u.likeCount}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>INTERES</div>
                              <div style={{ fontWeight: 900, color: 'var(--primary)' }}>{typeof Array.from(u.mediaList)[0] === 'string' ? (Array.from(u.mediaList)[0] as string).split('-')[0] : ''}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 3. MODERATION (Visual) */}
            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SectionHeader title="Moderare Social" subtitle="Control vizual direct peste conținut." />
                  {Object.keys(socialData).length === 0 && (
                    <button onClick={injectMockData} className="btn-send-animated" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#3b82f6', marginBottom: '2.5rem' }}>Generare Date Test</button>
                  )}
                </div>
                <div className="dash-scroll-container">
                  {Object.keys(socialData).length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5, border: '1px dashed var(--border)', borderRadius: '16px' }}>
                      <MessageCircle size={40} style={{ marginBottom: '1rem' }} />
                      <p>Niciun conținut interactiv găsit pe site.<br/>Când utilizatorii vor începe să aprecieze sau să comenteze fișierele media, vor apărea aici.</p>
                    </div>
                  ) : (
                    Object.entries(socialData).map(([id, data]: [string, any]) => {
                    const isHidden = (data.tags || []).includes('hidden');
                    return (
                      <div key={id} className="feature-card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1.5rem', border: isHidden ? '1px solid #ff4444' : '1px solid var(--border)' }}>
                        <div style={{ width: '100px', height: '130px', borderRadius: '12px', overflow: 'hidden', background: '#000', position: 'relative', flexShrink: 0 }}>
                          {mediaMap[id]?.endsWith('.mp4') ? <video src={mediaMap[id]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={mediaMap[id]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          {isHidden && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EyeOff color="#fff" size={20}/></div>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <code style={{ fontSize: '0.75rem', fontWeight: 800, color: isHidden ? '#ff4444' : 'var(--primary)' }}>{id}</code>
                            <button onClick={() => toggleVisibility(id)} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}>{isHidden ? 'Publică' : 'Ascunde'}</button>
                          </div>
                          <div className="comment-mod-list">
                            {(data.comments || []).map((c: any, i: number) => (
                              <div key={i} style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.8rem', borderRadius: '8px', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><strong>{c.user}:</strong> {c.text}</span>
                                <button onClick={() => deleteComment(id, i)} style={{ border: 'none', background: 'transparent', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={12}/></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </motion.div>
            )}

            {/* CMS */}
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionHeader title="CMS Editor" subtitle="Modifică orice text de pe site live." />
                
                <div className="feature-card" style={{ padding: '0.8rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid var(--border)', borderRadius: '12px', flexWrap: 'wrap' }}>
                  {Object.keys(t).map(section => (
                    typeof t[section] === 'object' && (
                      <button 
                        key={section} 
                        onClick={() => setCmsCategory(section)} 
                        style={{ 
                          background: cmsCategory === section ? 'var(--primary)' : 'var(--bg-dark)', 
                          color: cmsCategory === section ? '#fff' : 'var(--text-muted)',
                          padding: '0.4rem 0.8rem', 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: cmsCategory === section ? 'none' : '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          transition: '0.2s',
                          whiteSpace: 'nowrap',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {section}
                      </button>
                    )
                  ))}
                </div>

                <div className="dash-scroll-container" style={{ padding: '0 0.5rem' }}>
                  {Object.entries(t).filter(([sec]) => cmsCategory === 'All' ? true : sec === cmsCategory).map(([section, keys]: [string, any]) => (
                    typeof keys === 'object' && (
                      <div key={section} style={{ marginBottom: '2.5rem', background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h4 style={{ color: 'var(--primary)', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem', fontSize: '1.2rem' }}>Secțiune: {section.toUpperCase()}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                          {Object.entries(keys).map(([key, value]: [string, any]) => (
                            typeof value === 'string' && (
                              <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                                {value.length > 50 ? (
                                  <textarea 
                                    defaultValue={editingTexts[section]?.[key] || value} 
                                    onBlur={(e) => saveText(section, key, e.target.value)} 
                                    style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px', outline: 'none', resize: 'vertical', lineHeight: '1.5', fontFamily: 'inherit' }} 
                                  />
                                ) : (
                                  <input 
                                    type="text"
                                    defaultValue={editingTexts[section]?.[key] || value} 
                                    onBlur={(e) => saveText(section, key, e.target.value)} 
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '10px', outline: 'none', fontFamily: 'inherit' }} 
                                  />
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* BRANDING */}
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionHeader title="Branding Studio" subtitle="Personalizează identitatea vizuală a întregului site." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="feature-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={resetTheme} className="btn btn-secondary" style={{ borderStyle: 'dashed', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Revenire la Setări Fabrică</button>
                      </div>

                      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Culori Principale</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                          <ColorRow label="Culoare Brand (Primary)" value={themeConfig.primary} onChange={(v:any) => updateTheme('primary', v)} />
                          <ColorRow label="Culoare Secundară (Secondary)" value={themeConfig.secondary} onChange={(v:any) => updateTheme('secondary', v)} />
                          <ColorRow label="Culoare Text (Text Main)" value={themeConfig.textMain} onChange={(v:any) => updateTheme('textMain', v)} />
                          <ColorRow label="Text Secundar (Text Muted)" value={themeConfig.textMuted} onChange={(v:any) => updateTheme('textMuted', v)} />
                        </div>
                      </div>
                      
                      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Culori Fundal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                          <ColorRow label="Fundal Site (Dark)" value={themeConfig.bgDark} onChange={(v:any) => updateTheme('bgDark', v)} />
                          <ColorRow label="Fundal Carduri (Bg Card)" value={themeConfig.bgCard} onChange={(v:any) => updateTheme('bgCard', v)} />
                        </div>
                      </div>

                      <div>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Structură & Forme</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          <RangeRow label="Rotunjire Butoane" value={themeConfig.btnRadius} max={50} onChange={(v:any) => updateTheme('btnRadius', v)} />
                          <RangeRow label="Rotunjire Carduri" value={themeConfig.cardRadius} max={50} onChange={(v:any) => updateTheme('cardRadius', v)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* LIVE PREVIEW PANEL */}
                  <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', opacity: 0.5, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Live Preview (Cum se va vedea)</h3>
                    <div className="feature-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: themeConfig.bgDark }}>
                      <h1 style={{ color: themeConfig.textMain, margin: 0 }}>Titlul Principal</h1>
                      <p style={{ color: themeConfig.textMuted, lineHeight: 1.6, margin: 0 }}>
                        Acesta este un text secundar. Aici poți vedea cum se comportă culorile și contrastul atunci când utilizatorul citește un paragraf mai lung.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn" style={{ background: themeConfig.primary, color: '#fff', borderRadius: `${themeConfig.btnRadius}px`, border: 'none', padding: '1rem 2rem', fontWeight: 800 }}>Buton Principal</button>
                        <button className="btn" style={{ background: 'transparent', color: themeConfig.textMain, borderRadius: `${themeConfig.btnRadius}px`, border: `2px solid ${themeConfig.primary}`, padding: '1rem 2rem', fontWeight: 800 }}>Buton Secundar</button>
                      </div>

                      <div style={{ marginTop: '2rem', background: themeConfig.bgCard, padding: '1.5rem', borderRadius: `${themeConfig.cardRadius}px`, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: themeConfig.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon color="#fff" size={20}/>
                          </div>
                          <div>
                            <div style={{ color: themeConfig.textMain, fontWeight: 800 }}>Exemplu Card Intern</div>
                            <div style={{ color: themeConfig.textMuted, fontSize: '0.8rem' }}>Acesta simulează un card de curs sau profil de user.</div>
                          </div>
                        </div>
                        <div style={{ height: '4px', width: '100%', background: themeConfig.secondary, borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '45%', background: themeConfig.primary }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <SectionHeader title="Securitate & Control" subtitle="Gestionarea avansată a accesului. Bifează pentru a bloca un utilizator." />
                  {userStats.length === 0 && (
                    <button onClick={injectMockData} className="btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Generare Date Test</button>
                  )}
                </div>
                
                <div className="feature-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '1rem', minWidth: '200px' }}>Utilizator</th>
                        <th style={{ padding: '1rem', width: '120px' }}>Stare Acces</th>
                        <th style={{ padding: '1rem' }}>Comentarii</th>
                        <th style={{ padding: '1rem' }}>Like-uri</th>
                        <th style={{ padding: '1rem' }}>Pagini Vizitate</th>
                        <th style={{ padding: '1rem' }}>Prima Activitate</th>
                        <th style={{ padding: '1rem' }}>Ultima Activitate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userStats.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                            <ShieldAlert size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Nu există date despre utilizatori momentan.</p>
                          </td>
                        </tr>
                      ) : (
                        userStats.map((u: any) => {
                          const isBanned = bannedUsers.includes(u.name);
                          return (
                            <tr key={u.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isBanned ? 'rgba(255,0,0,0.05)' : 'transparent', transition: 'background 0.3s' }}>
                              <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="user-avatar-mini" style={{ width: '36px', height: '36px', background: isBanned ? '#ff4444' : 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isBanned ? '#ff4444' : 'var(--text-main)' }}>{u.name}</div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                  <div style={{ position: 'relative', width: '36px', height: '20px', background: isBanned ? '#ff4444' : '#10b981', borderRadius: '10px', transition: '0.3s' }}>
                                    <div style={{ position: 'absolute', top: '2px', left: isBanned ? '18px' : '2px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                                    <input 
                                      type="checkbox" 
                                      checked={isBanned} 
                                      onChange={() => { isBanned ? unbanUser(u.name) : banUser(u.name); addToast(`Stare actualizată pentru ${u.name}`, isBanned ? 'success' : 'error'); }}
                                      style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                  </div>
                                </label>
                              </td>
                              <td style={{ padding: '1rem', fontWeight: 900 }}>{u.commentCount}</td>
                              <td style={{ padding: '1rem', fontWeight: 900 }}>{u.likeCount}</td>
                              <td style={{ padding: '1rem', fontSize: '0.75rem', opacity: 0.8, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {Array.from(u.mediaList).join(', ')}
                              </td>
                              <td style={{ padding: '1rem', fontSize: '0.75rem', opacity: 0.6 }}>{u.firstActive}</td>
                              <td style={{ padding: '1rem', fontSize: '0.75rem', opacity: 0.6 }}>{u.lastActive}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Helpers
function NavBtn({ active, onClick, icon, label }: any) {
  return <button onClick={onClick} className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', gap: '0.8rem', width: '100%', padding: '0.75rem 1rem', fontSize: '0.9rem', border: active ? 'none' : '1px solid transparent' }}>{icon} {label}</button>;
}
function SectionHeader({ title, subtitle }: any) {
  return <div style={{ marginBottom: '1.5rem' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.3rem' }}>{title}</h1><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subtitle}</p></div>;
}
function StatCard({ icon, label, value, color }: any) {
  return <div className="feature-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: `3px solid ${color}` }}><div>{icon}</div><div><div style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase' }}>{label}</div><div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{value}</div></div></div>;
}
function ColorRow({ label, value, onChange }: any) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: 700 }}>{label}</span><input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: '35px', height: '35px', border: 'none', borderRadius: '50%', cursor: 'pointer' }} /></div>;
}
function RangeRow({ label, value, max, onChange }: any) {
  return <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ fontWeight: 700 }}>{label}</span><span style={{ fontWeight: 900, color: 'var(--primary)' }}>{value}px</span></div><input type="range" max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} /></div>;
}

export default Dashboard;