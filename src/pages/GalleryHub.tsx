import { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Facebook, MessageSquare, Link as LinkIcon, X } from 'lucide-react';
import { AuthContext, ToastContext } from '../App';
import '../App.css';

// --- AUTOMATIZARE DISCOVERY ---
const mediaFiles = import.meta.glob('../../public/Storage/Galerie/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

const autoGalleryData = Object.entries(mediaFiles).map(([path, module]: [string, any], index) => {
  const parts = path.split('/');
  const category = parts.length >= 2 ? parts[parts.length - 2] : 'General';
  const fileName = parts[parts.length - 1] || 'moment';
  const type = fileName.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
  const rawUrl = typeof module === 'string' ? module : (module.default || '');
  const finalUrl = String(rawUrl).replace('/public', '').replace('../../public', '');
  const dateMatch = fileName.match(/^\[(\d{4}-\d{2}-\d{2})\]/);
  const dateStr = dateMatch ? dateMatch[1] : '2026-01-01';

  return {
    id: `${category.toLowerCase()}-${fileName.replace(/\s+/g, '-').toLowerCase()}` || `id-${index}`,
    name: fileName.replace(/^\[\d{4}-\d{2}-\d{2}\]\s*/, '').split('.')[0].replace(/_/g, ' ').replace(/WhatsApp Video \d+-\d+-\d+ at \d+.\d+.\d+/, 'LTD Moment'),
    url: finalUrl,
    type: type,
    dance: category,
    dateDisplay: dateStr,
    timestamp: new Date(dateStr).getTime()
  };
});

interface Comment { user: string; text: string; isAdmin: boolean; date: string; }
interface SocialState { [mediaId: string]: { tags: string[]; comments: Comment[]; likes?: number; likedBy?: string[]; }; }

function GalleryHub() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  
  const [activeDance, setActiveDance] = useState('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [showControls, setShowControls] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const [socialData, setSocialData] = useState<SocialState>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');

  // --- HOVER SCROLL LOGIC ---
  const hoverRef = useRef<number>(0); 
  const animRef = useRef<number | null>(null);

  const startHoverScroll = () => {
    if (animRef.current) return;
    const animate = () => {
      if (scrollRef.current && Math.abs(hoverRef.current) > 0.05) {
        scrollRef.current.scrollLeft += hoverRef.current * 20; 
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const stopHoverScroll = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    hoverRef.current = 0;
  };
  // Folosim functia pentru a evita eroarea de neutilizare
  useEffect(() => {
    return () => stopHoverScroll();
  }, []);

  const handleMouseMoveHover = (e: React.MouseEvent) => {
    if (!scrollRef.current || isDragging) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = x / rect.width;
    
    if (normalizedX > 0.3 && normalizedX < 0.7) {
      hoverRef.current = 0;
    } else if (normalizedX <= 0.3) {
      hoverRef.current = -1 * ((0.3 - normalizedX) / 0.3);
    } else {
      hoverRef.current = (normalizedX - 0.7) / 0.3;
    }
  };

  // --- FILTRARE ---
  const filteredItems = useMemo(() => {
    let items = autoGalleryData.filter(item => {
      const matchesDance = activeDance === 'All' || item.dance === activeDance;
      if (activeTag) {
        const itemSocial = socialData[item.id];
        return matchesDance && itemSocial?.tags?.includes(activeTag.toLowerCase());
      }
      return matchesDance;
    });
    return items.sort((a, b) => sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
  }, [activeDance, activeTag, socialData, sortOrder]);

  useEffect(() => { setActiveIndex(0); }, [activeDance, activeTag]);

  const activeItem = filteredItems.length > 0 ? filteredItems[activeIndex] : null;
  const currentSocial = activeItem ? (socialData[activeItem.id] || { tags: [], comments: [], likes: Math.floor(Math.random() * 50) + 10, likedBy: [] }) : { tags: [], comments: [], likes: 0, likedBy: [] };

  useEffect(() => {
    localStorage.setItem('ltd_social_data', JSON.stringify(socialData));
  }, [socialData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeItem) return;
    const comment: Comment = { 
      user: user?.name || 'Vizitator', 
      text: newComment, 
      isAdmin: user?.role === 'admin', 
      date: new Date().toLocaleString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }).replace(',', '')
    };
    setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, comments: [...currentSocial.comments, comment] } }));
    setNewComment('');
    addToast('Comentariu adăugat!', 'success');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && activeItem) {
      const tag = newTag.trim().toLowerCase();
      if (!currentSocial.tags.includes(tag)) {
        setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, tags: [...currentSocial.tags, tag] } }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!activeItem) return;
    setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, tags: currentSocial.tags.filter(t => t !== tagToRemove) } }));
  };

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % (filteredItems.length || 1));
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));

  const handleViewerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.media-interaction-bar') || target.closest('.share-menu-floating')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.15) handlePrev();
    else if (x > rect.width * 0.85) handleNext();
  };

  const handleLike = () => {
    if (!activeItem) return;
    const userId = user?.id || 'guest-session';
    const likedBy = currentSocial.likedBy || [];
    const isLiked = likedBy.includes(userId);
    const newLikedBy = isLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId];
    const newLikes = (currentSocial.likes || 0) + (isLiked ? -1 : 1);
    setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, likes: newLikes, likedBy: newLikedBy } }));
    if (!isLiked) addToast('❤️', 'info');
  };

  const handleShare = (platform: string) => {
    if (!activeItem) return;
    const shareUrl = window.location.origin + activeItem.url;
    const message = `Vezi acest moment Love2Dance: ${shareUrl}`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); addToast('Copiat!', 'success'); }
    setShowShareMenu(false);
  };

  const fadeInUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const isLikedByMe = activeItem ? (currentSocial.likedBy || []).includes(user?.id || 'guest-session') : false;

  return (
    <motion.div className="page-container" style={{ padding: '2rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="filter-group-pro">
          <button onClick={() => {setActiveDance('All'); setActiveTag(null);}} className={activeDance === 'All' && !activeTag ? 'active' : ''}>Toate</button>
          {[...new Set(autoGalleryData.map(i => i.dance))].map(d => (
            <button key={d} onClick={() => {setActiveDance(d); setActiveTag(null);}} className={activeDance === d ? 'active' : ''}>{d}</button>
          ))}
        </div>
        {activeTag && (
          <div className="tag-pill" onClick={() => setActiveTag(null)} style={{ background: 'var(--primary)', color: '#fff' }}>
            Filtru: #{activeTag} <X size={14} />
          </div>
        )}
        <div className="filter-group-pro">
          <button onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'active' : ''}>Recente</button>
          <button onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'active' : ''}>Vechi</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredItems.length > 0 && activeItem ? (
          <motion.div key="content" className="gallery-main-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="gallery-media-col">
              <div 
                ref={scrollRef} 
                className="thumbnails-scroll-container" 
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={stopDragging} onMouseLeave={stopDragging}
                onMouseEnter={startHoverScroll} onMouseMoveCapture={handleMouseMoveHover}
                style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', padding: '1rem 0', scrollbarWidth: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {filteredItems.map((item, idx) => (
                  <div 
                    key={item.id} onClick={() => setActiveIndex(idx)} 
                    style={{ width: '120px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: `3px solid ${activeIndex === idx ? 'var(--primary)' : 'transparent'}`, opacity: activeIndex === idx ? 1 : 0.6, cursor: 'pointer' }}
                  >
                    {item.type === 'image' ? <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <video src={item.url + '#t=0.5'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />}
                  </div>
                ))}
              </div>

              <div className="gallery-viewer-container" onClick={handleViewerClick} onDoubleClick={handleLike} onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                <div className="media-interaction-bar">
                  <div className={`interaction-item ${isLikedByMe ? 'liked' : ''}`} onClick={handleLike}>
                    <div className="interaction-btn"><Heart size={24} fill={isLikedByMe ? "currentColor" : "none"} /></div>
                    <span className="interaction-count">{currentSocial.likes || 0}</span>
                  </div>
                  <div className="interaction-item" onClick={() => commentInputRef.current?.focus()}>
                    <div className="interaction-btn"><MessageCircle size={24} /></div>
                    <span className="interaction-count">{currentSocial.comments.length}</span>
                  </div>
                  <div className="interaction-item">
                    <div className="interaction-btn" onClick={() => setShowShareMenu(!showShareMenu)}><Share2 size={24} /></div>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div className="share-menu-floating" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <button className="share-option" onClick={() => handleShare('whatsapp')}><MessageSquare size={18} /></button>
                          <button className="share-option" onClick={() => handleShare('facebook')}><Facebook size={18} /></button>
                          <button className="share-option" onClick={() => handleShare('copy')}><LinkIcon size={18} /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {activeItem.type === 'image' ? (
                  <img src={activeItem.url} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                ) : (
                  <video ref={videoRef} src={activeItem.url} autoPlay loop controls={showControls} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                )}

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'var(--primary)' }}>{activeItem.dance}</span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)' }}>{activeItem.dateDisplay}</span>
                  </div>
                  <h3 style={{ margin: 0 }}>{activeItem.name}</h3>
                </div>
              </div>
            </div>

            <motion.div className="gallery-social-col feature-card" variants={fadeInUp}>
              <div className="social-layout-split">
                <div className="comments-column">
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>COMENTARII ({currentSocial.comments.length})</div>
                  <div className="comments-feed">
                    {currentSocial.comments.length > 0 ? currentSocial.comments.map((c, i) => (
                      <div key={i} className="comment-bubble">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                          <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>{c.user}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>
                            {c.date}
                          </span>
                        </div>
                        <div>{c.text}</div>
                      </div>
                    )) : <div style={{ opacity: 0.5, padding: '2rem', textAlign: 'center' }}>Fii primul care lasă un comentariu!</div>}
                  </div>
                  <form onSubmit={handleAddComment} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div className="comment-input-wrapper">
                      <div className="user-avatar-mini">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                      </div>
                      <input 
                        ref={commentInputRef} 
                        type="text" 
                        placeholder="Scrie un comentariu..." 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.95rem' }} 
                      />
                      <motion.button 
                        type="submit" 
                        className="btn-send-animated"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '0.6rem', marginLeft: '3rem' }}>
                      Comentezi ca <strong>{user?.name || 'Vizitator'}</strong>
                    </div>
                  </form>
                </div>

                {/* DREAPTA: TAG-URI (Zona secundară) - Afișată condiționat */}
                {(currentSocial.tags.length > 0 || user?.role === 'admin') && (
                  <div className="tags-column">
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.2rem', textTransform: 'uppercase', textAlign: 'left' }}>Tags</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {currentSocial.tags.map(tag => (
                        <span key={tag} className="tag-pill" onClick={() => setActiveTag(tag)}>
                          #{tag} 
                          {user?.role === 'admin' && (
                            <span onClick={(e) => { e.stopPropagation(); removeTag(tag); }} style={{ opacity: 0.5, marginLeft: '0.4rem' }}>×</span>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {user?.role === 'admin' ? (
                      <>
                        <input type="text" placeholder="Adaugă #tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={handleAddTag} className="social-input" />
                        <div style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '0.5rem' }}>Doar adminul poate gestiona tag-urile.</div>
                      </>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Click pe un tag pentru a filtra galeria.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Selectează o categorie sau alt tag.</div>}
      </AnimatePresence>
    </motion.div>
  );
}

export default GalleryHub;