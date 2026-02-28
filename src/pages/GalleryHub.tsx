import { useState, useMemo, useRef, useEffect, useContext } from 'react';
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
    // REPARARE: ID UNIC prin combinarea categoriei cu numele fisierului
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
interface SocialState { [mediaId: string]: { tags: string[]; comments: Comment[]; }; }

function GalleryHub() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  
  const [activeDance, setActiveDance] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // --- HOVER SCROLL LOGIC ---
  const hoverRef = useRef<number>(0); // -1 la 1 (viteza)
  const animRef = useRef<number | null>(null);

  const startHoverScroll = () => {
    if (animRef.current) return;
    const animate = () => {
      if (scrollRef.current && Math.abs(hoverRef.current) > 0.1) {
        scrollRef.current.scrollLeft += hoverRef.current * 15; // 15 este multiplicatorul de viteza
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

  const handleMouseMoveHover = (e: React.MouseEvent) => {
    if (!scrollRef.current || isDragging) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offset = (e.clientX - centerX) / (rect.width / 2);
    hoverRef.current = offset; // Valoare intre -1 si 1
  };

  const [socialData, setSocialData] = useState<SocialState>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');

  // --- 1. DEFINIRE DATE (FILTRARE) ---
  const filteredItems = useMemo(() => {
    let items = autoGalleryData.filter(item => activeDance === 'All' || item.dance === activeDance);
    return items.sort((a, b) => sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
  }, [activeDance, sortOrder]);

  // --- 2. DEFINIRE ITEM ACTIV ---
  const activeItem = filteredItems.length > 0 ? filteredItems[activeIndex] : null;
  const currentSocial = activeItem ? (socialData[activeItem.id] || { tags: [], comments: [] }) : { tags: [], comments: [] };

  // --- 3. EFECTE (INTERSECTION OBSERVER) ---
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!activeItem || activeItem.type !== 'video' || !videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {});
          } else {
            if (!videoEl.paused) videoEl.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoEl);
    return () => {
      observer.unobserve(videoEl);
      observer.disconnect();
    };
  }, [activeItem, activeIndex]);

  useEffect(() => {
    localStorage.setItem('ltd_social_data', JSON.stringify(socialData));
  }, [socialData]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 2;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Handlers
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
    const comment: Comment = { user: user?.name || 'Vizitator', text: newComment, isAdmin: user?.role === 'admin', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, comments: [...currentSocial.comments, comment] } }));
    setNewComment('');
    addToast('Comentariu adăugat!', 'success');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && activeItem) {
      if (!currentSocial.tags.includes(newTag.trim())) {
        setSocialData(prev => ({ ...prev, [activeItem.id]: { ...currentSocial, tags: [...currentSocial.tags, newTag.trim().toLowerCase()] } }));
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

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { if (diff > 0) handleNext(); else handlePrev(); }
    touchStartX.current = null;
  };

  const handleViewerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.15) handlePrev();
    else if (x > rect.width * 0.85) handleNext();
    else if (activeItem?.type === 'video' && videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play(); else videoRef.current.pause();
    }
  };

  return (
    <div className="page-container fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div className="filter-group-pro">
          <button onClick={() => {setActiveDance('All'); setActiveIndex(0);}} className={activeDance === 'All' ? 'active' : ''}>Toate</button>
          {[...new Set(autoGalleryData.map(i => i.dance))].map(d => (
            <button key={d} onClick={() => {setActiveDance(d); setActiveIndex(0);}} className={activeDance === d ? 'active' : ''}>{d}</button>
          ))}
        </div>
        <div className="filter-group-pro">
          <button onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'active' : ''}>⬇ Recente</button>
          <button onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'active' : ''}>⬆ Vechi</button>
        </div>
      </div>

      {filteredItems.length > 0 && activeItem ? (
        <div className="gallery-main-layout">
          <div className="gallery-media-col">
            <div className="gallery-viewer-container" onClick={handleViewerClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ borderRadius: '24px', position: 'relative', background: '#000', width: '100%', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', color: '#fff', zIndex: 10 }}>‹</div>
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '2rem', color: '#fff', zIndex: 10 }}>›</div>
              
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeItem.type === 'image' ? (
                  <img src={activeItem.url} alt="" loading="lazy" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                ) : (
                  <video ref={videoRef} key={activeItem.id} src={activeItem.url} autoPlay loop preload="auto" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                )}
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>{activeItem.dance}</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)' }}>{activeItem.dateDisplay}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{activeItem.name}</h3>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              className="thumbnails-scroll-container" 
              onMouseDown={handleMouseDown}
              onMouseMove={(e) => {
                handleMouseMove(e);
                handleMouseMoveHover(e);
              }}
              onMouseUp={stopDragging}
              onMouseLeave={() => {
                stopDragging();
                stopHoverScroll();
              }}
              onMouseEnter={startHoverScroll}
              style={{ 
                display: 'flex', 
                gap: '0.8rem', 
                overflowX: 'auto', 
                padding: '1rem 0', 
                scrollbarWidth: 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              {filteredItems.map((item, idx) => (
                <div key={item.id} onClick={() => { if(!isDragging) setActiveIndex(idx); }} style={{ width: '120px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: `3px solid ${activeIndex === idx ? 'var(--primary)' : 'transparent'}`, cursor: isDragging ? 'grabbing' : 'pointer', opacity: activeIndex === idx ? 1 : 0.6 }}>
                  {item.type === 'image' ? (
                    <img src={item.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                  ) : (
                    <video src={item.url + '#t=0.5'} preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="gallery-social-col feature-card">
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1rem' }}>Tag-uri</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {currentSocial.tags.map(tag => (
                <span key={tag} className="badge" style={{ background: 'rgba(155,28,28,0.1)', color: 'var(--primary)', display: 'flex', gap: '0.4rem' }}>
                  #{tag} <span onClick={() => removeTag(tag)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
                </span>
              ))}
            </div>
            <input type="text" placeholder="Adaugă #tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={handleAddTag} className="social-input" />

            <div className="comments-feed">
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Comentarii ({currentSocial.comments.length})</div>
              {currentSocial.comments.map((c, i) => (
                <div key={i} className="comment-bubble">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                    <strong>{c.user}</strong> <span>{c.date}</span>
                  </div>
                  {c.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <input type="text" placeholder="Scrie..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1, padding: '0.7rem', borderRadius: '20px', background: 'var(--bg-dark)', color: 'inherit', border: '1px solid var(--border)' }} />
              <button type="submit" className="btn-primary" style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}>→</button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Selectează o categorie.</div>
      )}
    </div>
  );
}

export default GalleryHub;
