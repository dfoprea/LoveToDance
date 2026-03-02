import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}
    >
      {first.type === 'image' ? (
        <img src={first.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Course" />
      ) : (
        <video src={first.url} autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </motion.div>
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

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
      <motion.div className="page-header" style={{ marginBottom: '5rem', textAlign: 'center' }} variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="page-title">{t.classesPage.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem' }}>{t.classesPage.subtitle}</p>
      </motion.div>

      <motion.div 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {classes.map((c, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeInUp} 
            className="feature-card" 
            style={{ 
              padding: '2.5rem', 
              border: c.primary ? '2px solid var(--primary)' : '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <CourseMedia folderName={c.id} />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon}</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1rem', color: c.primary ? 'var(--primary)' : 'inherit' }}>{c.title}</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '2rem' }}>{c.desc}</p>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {c.details}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        style={{ marginTop: '6rem', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid var(--border)' }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{t.features.ctaTitle}</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          {t.features.ctaDesc}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-full"
          style={{ maxWidth: '350px', margin: '0 auto' }}
          onClick={() => navigate('/pricing')}
        >
          {t.features.ctaBtn}
        </motion.button>
      </motion.div>    </motion.div>
  );
}

export default Features;
