import { useContext } from 'react';
import { LanguageContext } from '../App';
import '../App.css';

function Documentation() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ marginBottom: '5rem' }}>
        <h1 className="page-title">{t.schedulePage.title}</h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem' }}>{t.schedulePage.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Weekly Schedule Table */}
        <div className="program-table-card">
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
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--primary)' }}>Claudia & Florin</td>
                </tr>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>MARȚI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:00 - 21:00</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Salsa & Bachata (Intermediari / Începători)</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--primary)' }}>Corina & Mickey</td>
                </tr>
                <tr>
                  <td data-label={t.schedulePage.tableHeaderDay} style={{ padding: '1.5rem 2rem', fontWeight: 800 }}>MIERCURI</td>
                  <td data-label={t.schedulePage.tableHeaderTime} style={{ padding: '1.5rem 2rem' }}>19:00 - 21:00</td>
                  <td data-label={t.schedulePage.tableHeaderClass} style={{ padding: '1.5rem 2rem' }}>Salsa & Bachata / Kizomba</td>
                  <td data-label={t.schedulePage.tableHeaderProfs} style={{ padding: '1.5rem 2rem', fontWeight: 700, color: 'var(--primary)' }}>Toată Echipa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Location & Info */}
        <div className="responsive-grid">
          <div className="feature-card">
            <h3>📍 {t.footer.contact}</h3>
            <p>Splaiul Unirii 162, București.</p>
            <p>Metrou Timpuri Noi.</p>
          </div>
          <div className="feature-card">
            <h3>📞 Call</h3>
            <p>0721 915 169 (Corina)</p>
          </div>
        </div>

      </div>

      {/* Banner decorativ inainte de footer */}
      <section className="final-cta-section" style={{ marginTop: '6rem', borderRadius: '30px', height: '300px' }}>
        <div className="final-cta-overlay" style={{ borderRadius: '30px' }}></div>
        <div className="final-cta-content">
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Pasiune prin dans la fiecare pas.</h2>
        </div>
      </section>
    </div>
  );
}

export default Documentation;
