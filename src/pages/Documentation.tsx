import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

function Documentation() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { hash } = useLocation();

  // Scroll la ancora daca venim din alta pagina cu un hash
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  const handleInstructorClick = (teamId: string) => {
    navigate(`/instructors#${teamId}`);
    // Fortam scroll-ul daca suntem deja pe pagina
    setTimeout(() => {
      const el = document.getElementById(teamId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header" style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h1 className="page-title">{t.schedulePage.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem' }}>{t.schedulePage.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Weekly Schedule Table */}
        <motion.div className="program-table-card" style={{ transition: 'box-shadow 0.3s ease' }}>
          <div className="program-table-header">
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{t.scheduleTitle || 'PROGRAM'}</h2>
          </div>
          <div className="minimal-table-container">
            <table className="minimal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>{t.schedulePage.tableHeaderDay}</th>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>{t.schedulePage.tableHeaderTime}</th>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>{t.schedulePage.tableHeaderClass}</th>
                  <th style={{ padding: '1.5rem 2rem', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>{t.schedulePage.tableHeaderProfs}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>LUNI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:00 - 20:00</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Salsa & Bachata (Începători)</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem' }}>
                    <span className="instructor-link" onClick={() => handleInstructorClick('Claudia_Florin')}>Claudia & Florin</span>
                  </td>
                </tr>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>MARȚI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:00 - 21:00</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Salsa & Bachata (Intermediari / Începători)</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem' }}>
                    <span className="instructor-link" onClick={() => handleInstructorClick('Corina_Micky')}>Corina & Mickey</span>
                  </td>
                </tr>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>MIERCURI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:00 - 21:00</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Salsa & Bachata / Kizomba</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem' }}>
                    <span className="instructor-link" onClick={() => navigate('/instructors')}>Toată Echipa</span>
                  </td>
                </tr>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>JOI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:30 - 21:30</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Kizomba & Practică Liberă</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem' }}>
                    <span className="instructor-link" onClick={() => handleInstructorClick('Anca_Cristi')}>Anca & Cristi</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Location & Info */}
        <div className="responsive-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          {/* SECȚIUNEA ADRESĂ */}
          <motion.div 
            className="feature-card" 
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            onClick={() => window.open('https://goo.gl/maps/YOUR_MAP_LINK', '_blank')}
          >
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>📍 Adresă</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Splaiul Unirii 162, București (Metrou Timpuri Noi).</p>
            <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', marginTop: '1.5rem', border: '1px solid var(--border)' }}>
              <iframe 
                title="Harta Love2Dance"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.526279934335!2d26.115867315525!3d44.42234097910243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff3c43653163%3A0xf6a65526868d447a!2sSplaiul%20Unirii%20162%2C%20Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1625000000000!5m2!1sro!2sro" 
                width="100%" height="100%" style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2)' }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </motion.div>
          
          {/* SECȚIUNEA CONTACT CORINA */}
          <motion.div 
            className="feature-card" 
            style={{ transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/contact')}
          >
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 800 }}>
              📞 Contact 0721 915 169 (Corina)
            </h3>
            
            <button 
              className="btn btn-primary btn-glow" 
              style={{ width: '100%', padding: '1.5rem', fontSize: '1rem', whiteSpace: 'normal', lineHeight: '1.4' }}
            >
              Click pentru formular înscriere sau detalii
            </button>
          </motion.div>
        </div>

      </div>

      {/* Banner decorativ inainte de footer */}
      <motion.section 
        whileHover={{ scale: 1.01 }}
        className="final-cta-section" 
        style={{ marginTop: '6rem', borderRadius: '30px', height: '300px' }}
      >
        <div className="final-cta-overlay" style={{ borderRadius: '30px' }}></div>
        <div className="final-cta-content">
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Pasiune prin dans la fiecare pas.</h2>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default Documentation;