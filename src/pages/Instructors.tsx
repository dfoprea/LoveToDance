import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { LanguageContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Instructori (Fixat Prod)
const instructorAssets = import.meta.glob('../../public/Storage/Instructori/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function InstructorGallery({ teamId }: { teamId: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const hoverRef = useRef<number>(0);

  const media = useMemo(() => {
    return Object.entries(instructorAssets)
      .filter(([path]) => path.includes(teamId))
      .map(([path, module]: [string, any]) => {
        const rawUrl = typeof module === 'string' ? module : (module.default || '');
        return {
          url: String(rawUrl).replace('/public', '').replace('../../public', ''),
          type: path.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
        };
      });
  }, [teamId]);

  // HOVER SCROLL LOGIC
  const startHoverScroll = () => {
    if (animRef.current) return;
    const animate = () => {
      if (scrollRef.current && Math.abs(hoverRef.current) > 0.1) {
        scrollRef.current.scrollLeft += hoverRef.current * 10;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const stopHoverScroll = () => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    hoverRef.current = 0;
  };

  const handleMouseMoveHover = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    hoverRef.current = (e.clientX - centerX) / (rect.width / 2);
  };

  if (media.length === 0) return null;
  const current = media[activeIndex];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div className="instructor-gallery-container">
        {current.type === 'image' ? (
          <img src={current.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Instructor" />
        ) : (
          <video src={current.url} autoPlay muted loop playsInline preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {media.length > 1 && (
        <div 
          ref={scrollRef}
          onMouseEnter={startHoverScroll}
          onMouseMove={handleMouseMoveHover}
          onMouseLeave={stopHoverScroll}
          style={{ 
            display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', 
            paddingBottom: '0.5rem', scrollbarWidth: 'none' 
          }}
        >
          {media.map((m, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              style={{ 
                width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                border: `3px solid ${activeIndex === idx ? 'var(--primary)' : 'transparent'}`,
                opacity: activeIndex === idx ? 1 : 0.5,
                flexShrink: 0,
                background: '#000'
              }}
            >
              {m.type === 'image' ? (
                <img src={m.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={m.url + '#t=0.5'} preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              )}
            </div>
          ))}
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

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 className="page-title">{t.instructors.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem', opacity: 0.6, maxWidth: '800px', margin: '0 auto' }}>{t.instructors.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {teams.map((team) => (
          <div key={team.id} className="instructor-section">
            <InstructorGallery teamId={team.id} />
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{team.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {team.tags.map(tag => <span key={tag} className="badge" style={{ background: 'rgba(155,28,28,0.1)', color: 'var(--primary)', fontWeight: 700 }}>{tag}</span>)}
              </div>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>{team.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Instructors;
