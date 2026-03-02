import { useContext } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { LanguageContext, ToastContext } from '../App';
import '../App.css';

function Contact() {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Mesajul tău a fost trimis cu succes! Te vom contacta în curând.', 'success');
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.main 
      className="page-container" 
      role="main" 
      aria-label={t.contactPage.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="feature-card" 
        style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{t.contactPage.title}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          {t.contactPage.subtitle || 'Lasă-ne un mesaj și te vom contacta în cel mai scurt timp.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.contactPage.name}</label>
            <input id="contact-name" required type="text" style={{ width: '100%', padding: '0.85rem', borderRadius: '6px', outline: 'none' }} />
          </div>
          <div>
            <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.contactPage.email}</label>
            <input id="contact-email" required type="email" style={{ width: '100%', padding: '0.85rem', borderRadius: '6px', outline: 'none' }} />
          </div>
          <div>
            <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.contactPage.message}</label>
            <textarea id="contact-message" required rows={5} style={{ width: '100%', padding: '0.85rem', borderRadius: '6px', outline: 'none', resize: 'vertical' }}></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button 
              type="submit" 
              className="btn-primary-full btn-glow" 
              style={{ marginTop: '1rem', padding: '1rem 3rem' }}
              whileTap={{ scale: 0.98 }}
            >
              {t.contactPage.btn}
            </motion.button>
          </div>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>{t.contactPage.info || 'Program: L-V: 18:00 - 22:00 | S: 21:00 - 03:00'}</p>
        </div>
      </motion.div>
    </motion.main>
  );
}

export default Contact;