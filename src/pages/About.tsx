import { useContext } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { LanguageContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Despre Noi (Fixat Prod)
const aboutAssets = import.meta.glob('../../public/Storage/Despre_Noi/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function About() {
  const { t } = useContext(LanguageContext);

  const mediaList = Object.entries(aboutAssets).map(([path, module]: [string, any]) => {
    const rawUrl = typeof module === 'string' ? module : (module.default || '');
    return {
      url: String(rawUrl).replace('/public', '').replace('../../public', ''),
      type: path.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
    };
  });

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <motion.div 
      className="page-container" 
      style={{ padding: '4rem 2rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'center' }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} variants={staggerContainer}>
          {mediaList.length > 0 ? (
            mediaList.slice(0, 2).map((m, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                style={{ borderRadius: '24px', overflow: 'hidden', height: '350px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              >                {m.type === 'image' ? (
                  <img src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Despre Noi" />
                ) : (
                  <video src={m.url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </motion.div>
            ))
          ) : (
            <div style={{ height: '400px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border)' }}></div>
          )}
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem' }}>{t.aboutPage?.title || 'Despre Noi'}</h1>
          <h3 style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.5rem' }}>{t.aboutPage?.subtitle || 'Pasiune și Dans'}</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {t.aboutPage?.content || 'Suntem o comunitate de dansatori entuziaști.'}
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            La LovetoDance, credem că dansul este cea mai scurtă cale către fericire. Comunitatea noastră este formată din oameni pasionați care au descoperit că salsa și bachata sunt mai mult decât pași pe muzică.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default About;