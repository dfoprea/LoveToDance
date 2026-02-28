import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Cursuri (Fixat Prod)
const courseAssets = import.meta.glob('../../public/Storage/Cursuri/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function CourseMedia({ folderName }: { folderName: string }) {
  const media = useMemo(() => {
    return Object.entries(courseAssets)
      .filter(([path]) => path.includes(folderName))
      .map(([path, module]: [string, any]) => {
        const rawUrl = typeof module === 'string' ? module : (module.default || '');
        return {
          url: String(rawUrl).replace('/public', '').replace('../../public', ''),
          type: path.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
        };
      });
  }, [folderName]);

  if (media.length === 0) return null;

  const first = media[0];

  return (
    <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
      {first.type === 'image' ? (
        <img src={first.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Course" />
      ) : (
        <video src={first.url} autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  );
}

function Features() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const classes = [
    { id: 'Salsa_Bachata', title: t.classesPage.c1Title, desc: t.classesPage.c1Desc, details: 'Salsa LA Style (on 1) + Bachata Sensual & Moderna.', icon: '🔄', primary: true },
    { id: 'Kizomba', title: t.classesPage.c2Title, desc: t.classesPage.c2Desc, details: 'Tehnică de leading/following și figuri specifice.', icon: '✨' },
    { id: 'Rueda', title: t.classesPage.c3Title, desc: t.classesPage.c3Desc, details: 'Salsa în cerc - metoda perfectă pentru echipă.', icon: '⭕' },
    { id: 'Social', title: t.classesPage.c4Title, desc: t.classesPage.c4Desc, details: 'Pregătire pentru ringul de dans real.', icon: '💃' }
  ];

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ marginBottom: '5rem' }}>
        <h1 className="page-title">{t.classesPage.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem' }}>{t.classesPage.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        {classes.map((c, idx) => (
          <div key={idx} className="feature-card" style={{ 
            padding: '2.5rem', 
            border: c.primary ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CourseMedia folderName={c.id} />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon}</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1rem', color: c.primary ? 'var(--primary)' : 'inherit' }}>{c.title}</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '2rem' }}>{c.desc}</p>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {c.details}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '6rem', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Vrei să înveți să dansezi?</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Indiferent de stilul ales, abonamentul nostru lunar îți oferă libertate totală.
        </p>
        <button className="btn-primary-full" style={{ maxWidth: '350px', margin: '0 auto' }} onClick={() => navigate('/pricing')}>
          VEZI TARIFE & ÎNSCRIERE
        </button>
      </div>
    </div>
  );
}

export default Features;
