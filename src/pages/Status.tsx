import { Logo } from '../App';
import '../App.css';

function Status() {
  const studentName = "Elev LovetoDance";
  const lastUpdate = "Azi, 10:00";

  return (
    <div className="page-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div className="dash-section" style={{ width: '100%', maxWidth: '500px', padding: '4rem 2rem', borderRadius: '24px' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Logo size={64} />
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 900 }}>{studentName}</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', padding: '0.5rem 1.5rem', borderRadius: '99px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '2.5rem', border: '1px solid var(--primary)' }}>
          <span className="dot pulse" style={{ backgroundColor: 'var(--primary)' }}></span> ABONAMENT ACTIV
        </div>

        <div style={{ textAlign: 'left', background: 'var(--bg-dark)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💃 Salsa LA Style</span>
            <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.8rem' }}>4 ȘEDINȚE RĂMASE</span>
          </div>
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>🎵 Bachata Sensual</span>
            <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.8rem' }}>8 ȘEDINȚE RĂMASE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>🎉 Social Party Sâmbătă</span>
            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem' }}>CONFIRMAT</span>
          </div>
        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Ultima actualizare a prezenței: {lastUpdate}.<br/>
          Membru al comunității <strong>LovetoDance</strong>
        </p>
        
        <a href="/" style={{ display: 'inline-block', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
          &larr; Înapoi la Programul Cursurilor
        </a>
      </div>
    </div>
  );
}

export default Status;
