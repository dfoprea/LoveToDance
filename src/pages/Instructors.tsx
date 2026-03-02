import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Heart, Share2, Facebook, MessageSquare, Link as LinkIcon, X, Instagram, Music2 } from 'lucide-react';
import { LanguageContext, ToastContext, AuthContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Instructori (Fixat Prod)
const instructorAssets = import.meta.glob('../../public/Storage/Instructori/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function InstructorGallery({ teamId }: { teamId: string }) {
  const { addToast } = useContext(ToastContext);
  const { user, bannedUsers, isContentVisible } = useContext(AuthContext);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [socialData, setSocialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const allMedia = useMemo(() => {
    return Object.entries(instructorAssets)
      .filter(([path]) => path.includes(teamId))
      .map(([path, module]: [string, any]) => {
        const rawUrl = typeof module === 'string' ? module : (module.default || '');
        const finalUrl = String(rawUrl).replace('/public', '').replace('../../public', '');
        return {
          id: `instr-${teamId}-${path.split('/').pop()}`,
          url: finalUrl,
          type: path.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
        };
      });
  }, [teamId]);

  // FILTRARE PRIN TAG-URI SI VIZIBILITATE
  const media = useMemo(() => {
    return allMedia.filter(item => {
      const itemData = socialData[item.id] || { tags: [] };
      
      // LOGICĂ VIZIBILITATE
      if (!isContentVisible(item.id, itemData.tags)) return false;

      if (activeTag) {
        return itemData.tags.includes(activeTag.toLowerCase());
      }
      return true;
    });
  }, [allMedia, activeTag, socialData, isContentVisible]);

  useEffect(() => { setActiveIndex(0); }, [activeTag]);

  useEffect(() => {
    localStorage.setItem('ltd_social_data', JSON.stringify(socialData));
  }, [socialData]);

  const startHoverScroll = (e: React.MouseEvent) => {
    isHovering.current = true;
    if (!scrollRef.current) return;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const stopHoverScroll = () => {
    isHovering.current = false;
  };

  const handleMouseMoveHover = (e: React.MouseEvent) => {
    if (!isHovering.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleLike = () => {
    const current = media[activeIndex];
    if (!current) return;

    // Protectie ban
    if (user && bannedUsers.includes(user.name)) return;

    const userId = user?.id || 'guest-session';
    const itemData = socialData[current.id] || { likes: 0, likedBy: [], tags: [] };
    
    const hasLiked = (itemData.likedBy || []).includes(userId);
    let newLikes = itemData.likes || 0;
    let newLikedBy = itemData.likedBy || [];
    
    if (hasLiked) {
      newLikes = Math.max(0, newLikes - 1);
      newLikedBy = newLikedBy.filter((id: string) => id !== userId);
    } else {
      newLikes += 1;
      newLikedBy.push(userId);
    }

    setSocialData((prev: any) => ({
      ...prev,
      [current.id]: { ...itemData, likes: newLikes, likedBy: newLikedBy }
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    const current = media[activeIndex];
    if (e.key === 'Enter' && newTag.trim() && current) {
      const tag = newTag.trim().toLowerCase();
      const itemData = socialData[current.id] || { likes: 0, likedBy: [], tags: [] };
      const currentTags = itemData.tags || [];
      
      if (!currentTags.includes(tag)) {
        setSocialData((prev: any) => ({
          ...prev,
          [current.id]: { ...itemData, tags: [...currentTags, tag] }
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const current = media[activeIndex];
    if (!current) return;
    const itemData = socialData[current.id];
    setSocialData((prev: any) => ({
      ...prev,
      [current.id]: { ...itemData, tags: itemData.tags.filter((t: string) => t !== tagToRemove) }
    }));
  };

  const handleShare = (platform: string) => {
    const current = media[activeIndex];
    if (!current) return;
    const shareUrl = window.location.origin + current.url;
    const message = `Vezi acest moment cu instructorii LTD: ${shareUrl}`;

    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'instagram' || platform === 'tiktok' || platform === 'copy') { 
      navigator.clipboard.writeText(shareUrl); 
      addToast(platform === 'copy' ? 'Link copiat!' : `Link copiat pentru ${platform.charAt(0).toUpperCase() + platform.slice(1)}! ✅`, 'success'); 
    }
    setShowShareMenu(false);
  };

  if (allMedia.length === 0) return null;
  const current = media[activeIndex];
  const currentData = current ? (socialData[current.id] || { likes: 0, likedBy: [], tags: [] }) : { likes: 0, likedBy: [], tags: [] };
  const isLikedByMe = (currentData.likedBy || []).includes(user?.id || 'guest-session');

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* 1. THUMBNAILS (SUS) */}
      {allMedia.length > 1 && (
        <div 
          ref={scrollRef}
          onMouseEnter={startHoverScroll}
          onMouseMove={handleMouseMoveHover}
          onMouseLeave={stopHoverScroll}
          style={{ 
            display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', 
            paddingBottom: '0.5rem', scrollbarWidth: 'none' 
          }}
        >
          {allMedia.map((m, idx) => {
            const isSelected = current?.url === m.url;
            return (
              <motion.div
                key={idx}
                onClick={() => {
                  const newIdx = media.findIndex(item => item.url === m.url);
                  if (newIdx !== -1) setActiveIndex(newIdx);
                  else { setActiveTag(null); setTimeout(() => {
                    const resetIdx = allMedia.findIndex(item => item.url === m.url);
                    setActiveIndex(resetIdx);
                  }, 10); }
                }}
                style={{ 
                  width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', 
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                  opacity: isSelected ? 1 : 0.5,
                  flexShrink: 0
                }}
              >
                {m.type === 'image' ? (
                  <img src={m.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={m.url + '#t=0.5'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 2. MEDIA VIEWER (MIJLOC) */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div 
            key={current.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="instructor-gallery-container"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => { setShowControls(false); setShowShareMenu(false); }}
            style={{ position: 'relative' }}
          >
            <div className="media-interaction-bar" style={{ bottom: '2rem', transform: 'none', right: '1rem', gap: '1rem' }}>
              <div className={`interaction-item ${isLikedByMe ? 'liked' : ''}`} onClick={handleLike}>
                <div className="interaction-btn" style={{ width: '40px', height: '40px' }}><Heart size={20} fill={isLikedByMe ? "currentColor" : "none"} /></div>
                <span className="interaction-count" style={{ fontSize: '0.65rem' }}>{currentData.likes || 0}</span>
              </div>
              
              <div className="interaction-item" style={{ position: 'relative' }}>
                <div className="interaction-btn" style={{ width: '40px', height: '40px' }} onClick={() => setShowShareMenu(!showShareMenu)}><Share2 size={20} /></div>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div className="share-menu-floating" style={{ bottom: '0', right: '50px' }} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <button className="share-option" onClick={() => handleShare('whatsapp')} title="WhatsApp"><MessageSquare size={16} /></button>
                      <button className="share-option" onClick={() => handleShare('facebook')} title="Facebook"><Facebook size={16} /></button>
                      <button className="share-option" onClick={() => handleShare('instagram')} title="Instagram"><Instagram size={16} /></button>
                      <button className="share-option" onClick={() => handleShare('tiktok')} title="TikTok"><Music2 size={16} /></button>
                      <button className="share-option" onClick={() => handleShare('copy')} title="Copy Link"><LinkIcon size={16} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {current.type === 'image' ? (
              <img src={current.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onDoubleClick={handleLike} />
            ) : (
              <video src={current.url} autoPlay muted={!showControls} loop playsInline preload="auto" controls={showControls} onDoubleClick={handleLike} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
            )}
          </motion.div>
        ) : (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '24px' }}>
            <button onClick={() => setActiveTag(null)} className="btn-secondary">Resetare Filtru Tag</button>
          </div>
        )}
      </AnimatePresence>

      {/* 3. TAGS SECTION (JOS) - Apare doar dacă există activitate sau ești Admin */}
      {(activeTag || (currentData.tags && currentData.tags.length > 0) || user?.role === 'admin') && (
        <div className="tags-column" style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', padding: 0, border: 'none' }}>
          
          {/* Titlul apare doar dacă avem ce filtra */}
          {(activeTag || (currentData.tags && currentData.tags.length > 0)) && (
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>
              Tags
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {activeTag && (
              <span className="tag-pill" onClick={() => setActiveTag(null)} style={{ background: 'var(--primary)', color: '#fff' }}>
                Filtru: #{activeTag} <X size={12} />
              </span>
            )}
            {currentData.tags?.map((tag: string) => (
              <span key={tag} className="tag-pill" onClick={() => setActiveTag(tag)}>
                #{tag} 
                {user?.role === 'admin' && (
                  <span onClick={(e) => { e.stopPropagation(); removeTag(tag); }} style={{ marginLeft: '0.3rem', opacity: 0.5 }}>×</span>
                )}
              </span>
            ))}
          </div>

          {user?.role === 'admin' && current && (
            <div style={{ marginTop: currentData.tags?.length > 0 ? '0' : '0.5rem' }}>
              <input 
                type="text" placeholder="Adaugă #tag instructor..." value={newTag} 
                onChange={e => setNewTag(e.target.value)} onKeyDown={handleAddTag} 
                className="social-input" style={{ maxWidth: '200px', fontSize: '0.75rem', padding: '0.5rem 0.8rem', borderRadius: '15px' }} 
              />
              {(!currentData.tags || currentData.tags.length === 0) && (
                <div style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '0.4rem' }}>Niciun tag. Adaugă unul ca Admin.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Instructors() {
  const { t } = useContext(LanguageContext);

  const teams = [
    { id: 'Corina_Micky', name: t.instructors.team1, bio: t.instructors.team1Desc, tags: ['Salsa', 'Bachata'] },
    { id: 'Claudia_Florin', name: t.instructors.team2, bio: t.instructors.team2Desc, tags: ['Salsa', 'Bachata'] },
    { id: 'Anca_Cristi', name: t.instructors.team3, bio: t.instructors.team3Desc, tags: ['Kizomba'] }
  ];

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="page-header" style={{ textAlign: 'center', marginBottom: '6rem' }} variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="page-title">{t.instructors.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '800px', margin: '0 auto' }}>{t.instructors.subtitle}</p>
      </motion.div>

      <motion.div 
        style={{ display: 'flex', flexDirection: 'column' }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {teams.map((team) => (
          <motion.div key={team.id} id={team.id} className="instructor-section" variants={fadeInUp}>
            <InstructorGallery teamId={team.id} />
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{team.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                {team.tags.map(tag => <span key={tag} className="badge" style={{ background: 'rgba(155,28,28,0.1)', color: 'var(--primary)', fontWeight: 700 }}>{tag}</span>)}
              </div>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>{team.bio}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Instructors;