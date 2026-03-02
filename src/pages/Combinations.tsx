import { useState, useMemo, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Heart, Share2, Facebook, MessageSquare, Link as LinkIcon, MessageCircle, X, Send } from 'lucide-react';
import { ToastContext, AuthContext } from '../App';
import '../App.css';

// --- AUTOMATIZARE DISCOVERY pentru Combinatii (Fixat Prod) ---
const courseAssets = import.meta.glob('../../public/Storage/Cursuri/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

const autoComboData = Object.entries(courseAssets).map(([path, module]: [string, any], index) => {
  const parts = path.split('/');
  const category = parts.length >= 2 ? parts[parts.length - 2] : 'Curs';
  const fileName = parts[parts.length - 1] || 'video';
  
  const rawUrl = typeof module === 'string' ? module : (module.default || '');
  const finalUrl = String(rawUrl).replace('/public', '').replace('../../public', '');
  
  const dateMatch = fileName.match(/^\[(\d{4}-\d{2}-\d{2})\]/);
  const dateStr = dateMatch ? dateMatch[1] : '2026-02-27';

  return {
    id: `combo-${index}-${fileName.replace(/\s+/g, '-').toLowerCase()}`,
    title: fileName.replace(/^\[\d{4}-\d{2}-\d{2}\]\s*/, '').split('.')[0].replace(/_/g, ' ').replace(/WhatsApp Video \d+-\d+-\d+ at \d+.\d+.\d+/, 'LTD Combination'),
    url: finalUrl,
    category: category,
    date: dateStr,
    tags: [category.toLowerCase(), 'coregrafie'],
    isPublic: true
  };
});

function Combinations() {
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedYear, setSelectedYear] = useState('All');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [activeCommentsId, setActiveCommentsId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const commentsListRef = useRef<HTMLDivElement>(null);

  const availableYears = useMemo(() => {
    const years = autoComboData.map(c => c.date.split('-')[0]);
    return ['All', ...new Set(years)].sort((a, b) => b.localeCompare(a));
  }, []);

  const [socialData, setSocialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Auto-scroll la ultimul comentariu (Internal only, no page jumping)
  useEffect(() => {
    if (activeCommentsId && commentsListRef.current) {
      const el = commentsListRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [socialData, activeCommentsId]);

  useEffect(() => {
    localStorage.setItem('ltd_social_data', JSON.stringify(socialData));
  }, [socialData]);

  const filteredCombos = useMemo(() => {
    return autoComboData
      .filter(combo => {
        const matchesCategory = filter === 'All' || combo.category === filter;
        const matchesYear = selectedYear === 'All' || combo.date.startsWith(selectedYear);
        return matchesCategory && matchesYear;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [filter, selectedYear, sortOrder]);

  // Cel mai recent video (Featured)
  const latestCombo = useMemo(() => filteredCombos[0], [filteredCombos]);
  const archiveCombos = useMemo(() => filteredCombos.slice(1), [filteredCombos]);

  const handleLike = (comboId: string) => {
// ... restul functiilor ...
    const userId = user?.id || 'guest-session';
    const itemData = socialData[comboId] || { likes: 0, likedBy: [], comments: [] };
    const likedBy = itemData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    const newLikedBy = isLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId];
    const newLikes = (itemData.likes || 0) + (isLiked ? -1 : 1);
    setSocialData((prev: any) => ({ ...prev, [comboId]: { ...itemData, likes: newLikes, likedBy: newLikedBy } }));
    if (!isLiked) addToast('❤️', 'info');
  };

  const handleAddComment = (e: React.FormEvent, comboId: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const itemData = socialData[comboId] || { likes: 0, likedBy: [], comments: [] };
    const comment = {
      user: user?.name || 'Vizitator',
      text: newComment,
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
    };
    setSocialData((prev: any) => ({ ...prev, [comboId]: { ...itemData, comments: [...(itemData.comments || []), comment] } }));
    setNewComment('');
    addToast('💬 Postat!', 'success');
  };

  const handleShare = (url: string, platform: string) => {
    const shareUrl = window.location.origin + url;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); addToast('Link copiat!', 'success'); }
    setActiveShareId(null);
  };

  const fadeInUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const scaleUp: Variants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
  const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <motion.div className="page-container" style={{ padding: '2rem 2rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div style={{ textAlign: 'center', marginBottom: '2rem' }} variants={fadeInUp} initial="hidden" animate="visible">
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }} className="hero-accent">Coregrafii & Tehnici</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>Explorează ultimele mișcări predate la curs și arhiva noastră completă.</p>
      </motion.div>

      {/* 1. FEATURED SECTION (ULTIMA COMBINATIE) */}
      {latestCombo && filter === 'All' && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '4rem', maxWidth: '1000px', margin: '0 auto 4rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span className="badge" style={{ background: 'var(--primary)', padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>NOU la Curs</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--border), transparent)' }}></div>
          </div>

          <div className="course-card-pro" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0', padding: 0, borderRadius: '32px', overflow: 'hidden', minHeight: '550px' }}>
            {/* Player Video Mare */}
            <div style={{ background: '#000', position: 'relative', minHeight: '500px' }}>
              <video 
                src={latestCombo.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onDoubleClick={() => handleLike(latestCombo.id)}
                onClick={() => { if (activeCommentsId === latestCombo.id) setActiveCommentsId(null); }}
              />
              
              {/* Interaction Bar pentru Featured */}
              <div className="media-interaction-bar" style={{ 
                right: '1rem', bottom: '2rem', transform: 'none', gap: '1.2rem', zIndex: 100,
                opacity: activeCommentsId === latestCombo.id ? 0 : 1,
                pointerEvents: activeCommentsId === latestCombo.id ? 'none' : 'auto'
              }}>
                <div className={`interaction-item ${ (socialData[latestCombo.id]?.likedBy || []).includes(user?.id || 'guest-session') ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleLike(latestCombo.id); }}>
                  <div className="interaction-btn"><Heart size={22} fill={(socialData[latestCombo.id]?.likedBy || []).includes(user?.id || 'guest-session') ? "currentColor" : "none"} /></div>
                  <span className="interaction-count">{socialData[latestCombo.id]?.likes || 0}</span>
                </div>
                <div className="interaction-item" onClick={(e) => { e.stopPropagation(); setActiveCommentsId(latestCombo.id); }}>
                  <div className="interaction-btn"><MessageCircle size={22} /></div>
                  <span className="interaction-count">{(socialData[latestCombo.id]?.comments || []).length}</span>
                </div>
                <div className="interaction-item">
                  <div className="interaction-btn" onClick={(e) => { e.stopPropagation(); setActiveShareId(activeShareId === latestCombo.id ? null : latestCombo.id); }}><Share2 size={22} /></div>
                </div>
              </div>

              {/* Drawer pentru Featured */}
              <AnimatePresence>
                {activeCommentsId === latestCombo.id && (
                  <motion.div className="comment-drawer-overlay" style={{ zIndex: 200 }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()}>
                    <div className="drawer-header" style={{ border: 'none', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ccc', textAlign: 'left' }}>COMMENTS ({(socialData[latestCombo.id]?.comments || []).length})</span>
                      <button className="close-drawer-btn" style={{ background: 'transparent' }} onClick={() => setActiveCommentsId(null)}><X size={16} /></button>
                    </div>
                    <div className="drawer-comments-list" ref={commentsListRef} style={{ paddingBottom: '0.5rem', textAlign: 'left' }}>
                      {(socialData[latestCombo.id]?.comments || []).map((c: any, i: number) => (
                        <div key={i} className="comment-bubble" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>{c.user}</strong>
                            <span style={{ opacity: 0.5, fontSize: '0.55rem', color: '#fff' }}>{c.date}</span>
                          </div>
                          <div style={{ color: '#eee', fontSize: '0.75rem', textAlign: 'left' }}>{c.text}</div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => handleAddComment(e, latestCombo.id)} style={{ marginTop: 'auto' }}>
                      <div className="comment-input-wrapper" style={{ padding: '0.4rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}>
                        <input type="text" placeholder="Scrie un comentariu..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', padding: '0.5rem' }} />
                        <button type="submit" className="btn-send-animated" style={{ background: 'transparent', color: 'var(--primary)' }}><Send size={18} /></button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Text Lateral */}
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-card)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>
                Ultima actualizare: {latestCombo.date}
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: '1.1' }}>{latestCombo.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {latestCombo.tags.map(t => <span key={t} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>#{t}</span>)}
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                Aceasta este cea mai nouă coregrafie lucrată la sala de dans. Vino și tu să o înveți în cadrul cursurilor noastre de {latestCombo.category}!
              </p>
              <button 
                className="btn btn-primary btn-glow" 
                style={{ alignSelf: 'flex-start', padding: '1rem 2rem' }}
                onClick={() => navigate('/contact')}
              >
                Vreau să învăț și eu
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* 2. ARCHIVE SECTION (RESTUL VIDEOCLIPURILOR) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Arhivă</h2>
        <div style={{ height: '1px', flex: 1, minWidth: '50px', background: 'var(--border)' }}></div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 1. Category Filter (Priority) */}
          <div className="filter-group-pro">
            <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>Toate</button>
            {[...new Set(autoComboData.map(c => c.category))].map(cat => (
              <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>{cat}</button>
            ))}
          </div>

          {/* 2. Year Filter */}
          <div className="filter-group-pro">
            {availableYears.map(year => (
              <button 
                key={year} 
                className={selectedYear === year ? 'active' : ''} 
                onClick={() => setSelectedYear(year)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
              >
                {year === 'All' ? 'Toți anii' : year}
              </button>
            ))}
          </div>

          {/* 3. Sort Toggle */}
          <div className="filter-group-pro">
            <button className={sortOrder === 'desc' ? 'active' : ''} onClick={() => setSortOrder('desc')}>⬇ Noi</button>
            <button className={sortOrder === 'asc' ? 'active' : ''} onClick={() => setSortOrder('asc')}>⬆ Vechi</button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={filter} className="responsive-grid" variants={staggerContainer} initial="hidden" animate="visible">
          {archiveCombos.map(combo => {
            const itemSocial = socialData[combo.id] || {};
            const comments = itemSocial.comments || [];
            const likes = itemSocial.likes || 0;
            const likedBy = itemSocial.likedBy || [];
            const isLikedByMe = likedBy.includes(user?.id || 'guest-session');

            return (
              <motion.div key={combo.id} className="course-card-pro" variants={scaleUp} style={{ padding: '1rem', borderRadius: '24px', position: 'relative' }}>
                <div style={{ width: '100%', aspectRatio: '9 / 16', background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                  
                  {/* BACKGROUND VIDEO (FIXED) */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <video 
                      src={combo.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onDoubleClick={() => handleLike(combo.id)}
                      onClick={() => { if (activeCommentsId === combo.id) setActiveCommentsId(null); }}
                    />
                  </div>

                  {/* INTERACTION BAR (STABLE) */}
                  <div className="media-interaction-bar" style={{ 
                    right: '0.8rem', bottom: '2rem', transform: 'none', gap: '1rem', zIndex: 100,
                    opacity: activeCommentsId === combo.id ? 0 : 1,
                    pointerEvents: activeCommentsId === combo.id ? 'none' : 'auto',
                    transition: 'opacity 0.2s ease'
                  }}>
                    <div className={`interaction-item ${isLikedByMe ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleLike(combo.id); }}>
                      <div className="interaction-btn" style={{ width: '36px', height: '36px' }}><Heart size={18} fill={isLikedByMe ? "currentColor" : "none"} /></div>
                      <span className="interaction-count">{likes}</span>
                    </div>
                    <div className="interaction-item" onClick={(e) => { e.stopPropagation(); setActiveCommentsId(combo.id); }}>
                      <div className="interaction-btn" style={{ width: '36px', height: '36px' }}><MessageCircle size={18} /></div>
                      <span className="interaction-count">{comments.length}</span>
                    </div>
                    <div className="interaction-item" style={{ position: 'relative' }}>
                      <div className="interaction-btn" style={{ width: '36px', height: '36px' }} onClick={(e) => { e.stopPropagation(); setActiveShareId(activeShareId === combo.id ? null : combo.id); }}><Share2 size={18} /></div>
                      <AnimatePresence>
                        {activeShareId === combo.id && (
                          <motion.div className="share-menu-floating" style={{ bottom: '0', right: '45px' }} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onClick={(e) => e.stopPropagation()}>
                            <button className="share-option" style={{ width: '32px', height: '32px' }} onClick={() => handleShare(combo.url, 'whatsapp')}><MessageSquare size={14} /></button>
                            <button className="share-option" style={{ width: '32px', height: '32px' }} onClick={() => handleShare(combo.url, 'facebook')}><Facebook size={14} /></button>
                            <button className="share-option" style={{ width: '32px', height: '32px' }} onClick={() => handleShare(combo.url, 'copy')}><LinkIcon size={14} /></button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* DRAWER (OVERLAY) */}
                  <AnimatePresence>
                    {activeCommentsId === combo.id && (
                      <motion.div className="comment-drawer-overlay" style={{ zIndex: 200 }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="drawer-header" style={{ border: 'none', marginBottom: '0.3rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ccc', opacity: 0.9, letterSpacing: '0.5px', textAlign: 'left' }}>COMMENTS ({comments.length})</span>
                          <button className="close-drawer-btn" style={{ width: '20px', height: '24px', background: 'transparent' }} onClick={() => setActiveCommentsId(null)}><X size={14} /></button>
                        </div>
                        <div className="drawer-comments-list" ref={commentsListRef} style={{ paddingBottom: '0.5rem', textAlign: 'left' }}>
                          {comments.map((c: any, i: number) => (
                            <div key={i} className="comment-bubble" style={{ fontSize: '0.75rem', padding: '0.5rem 0.7rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.4rem', textAlign: 'left' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', alignItems: 'center' }}>
                                <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>{c.user}</strong>
                                <span style={{ opacity: 0.5, fontSize: '0.55rem', color: '#fff' }}>{c.date}</span>
                              </div>
                              <div style={{ color: '#eee', lineHeight: '1.3', textAlign: 'left' }}>{c.text}</div>
                            </div>
                          ))}
                          {comments.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem' }}>Fii primul care comentează!</div>}
                        </div>
                        <form onSubmit={(e) => handleAddComment(e, combo.id)} style={{ marginTop: 'auto' }}>
                          <div className="comment-input-wrapper" style={{ padding: '0.2rem 0.2rem 0.2rem 0.8rem', background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}>
                            <div className="user-avatar-mini" style={{ width: '24px', height: '24px', fontSize: '0.6rem', background: '#334155', opacity: 0.8 }}>{user?.name ? user.name.charAt(0).toUpperCase() : 'V'}</div>
                            <input type="text" placeholder="Scrie..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                            <button type="submit" className="btn-send-animated" style={{ width: '30px', height: '30px', background: 'transparent', color: 'var(--primary)' }}><Send size={16} /></button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div style={{ padding: '1.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <span>{combo.category}</span><span>{combo.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>{combo.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {combo.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>#{t}</span>)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default Combinations;