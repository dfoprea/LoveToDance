import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

function Legal() {
  const { t } = useContext(LanguageContext);
  const location = useLocation();

  // Determinam ce document afisam pe baza rutei
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <main className="page-container fade-in" role="main" aria-label={isPrivacy ? t.legalPage.privacyTitle : t.legalPage.termsTitle}>
      <div className="feature-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '3rem' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
          {isPrivacy ? t.legalPage.privacyTitle : t.legalPage.termsTitle}
        </h1>
        
        <section aria-labelledby="legal-content">
          <p id="legal-content" style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '3rem' }}>
            {isPrivacy ? t.legalPage.privacyText : t.legalPage.termsText}
          </p>
        </section>

        <section aria-labelledby="contact-title" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h2 id="contact-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t.legalPage.contactTitle}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {t.legalPage.contactInfo}
          </p>
        </section>
      </div>
    </main>
  );
}

export default Legal;
