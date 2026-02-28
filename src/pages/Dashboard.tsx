import { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LanguageContext, Logo, ToastContext, AuthContext } from '../App';
import '../App.css';

function Dashboard() {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext); // Preluam starea de autentificare
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // PROTECTIE: Daca nu e admin, trimitem la login
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      addToast('Acces refuzat! Te rugăm să te autentifici ca administrator.', 'error');
      navigate('/login');
    }
  }, [user, navigate, addToast]);

  if (!user || user.role !== 'admin') return null; // Prevenim randarea pana la redirect
  const isGuest = searchParams.get('guest') === 'true';

  const [isTesting, setIsTesting] = useState(false);
  
  // Theme Builder State
  const [primaryColor, setPrimaryColor] = useState('#9b1c1c');
  const [bgDarkColor, setBgDarkColor] = useState('#0f0f11');
  const [bgCardColor, setBgCardColor] = useState('#1a1a1e');
  const [btnRadius, setBtnRadius] = useState(10);
  
  const resetTheme = () => {
    setPrimaryColor('#9b1c1c');
    setBgDarkColor('#0f0f11');
    setBgCardColor('#1a1a1e');
    setBtnRadius(10);
    // Remove inline styles to let CSS take over again
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--bg-dark');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--radius-btn');
  };

  // Apply theme variables live
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--bg-dark', bgDarkColor);
    root.style.setProperty('--bg-card', bgCardColor);
    root.style.setProperty('--radius-btn', `${btnRadius}px`);
  }, [primaryColor, bgDarkColor, bgCardColor, btnRadius]);

  // Student Stats Simulation
  const [stats] = useState({ 
    sessionsLeft: 12, 
    activeCourses: 2, 
    attendances: 6, 
    daysToParty: 2 
  });

  const [copied] = useState(false);

  const handleTestAlert = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      addToast('Notificare de test trimisă cu succes pe WhatsApp!', 'success');
    }, 2000);
  };

  const copyScheduleLink = () => {
    const link = `${window.location.origin}/status/elev-demo`;
    navigator.clipboard.writeText(link);
    addToast('Link-ul a fost copiat în clipboard!', 'info');
  };

  return (
    <div className="dashboard-layout fade-in">
      
      {/* ADMIN: THEME BUILDER (LIVE PREVIEW) */}
      <div className="dash-section" style={{ 
        border: '2px solid var(--primary)', 
        padding: '2rem', 
        marginBottom: '3rem', 
        background: 'rgba(155, 28, 28, 0.05)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              🎨 Admin Panel: Theme Builder (Live)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Modifică aspectul site-ului în timp real. Schimbările se aplică instant pe tot site-ul.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={resetTheme}
              style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Resetare la Default
            </button>
            <span className="badge" style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
              DEVELOPER PREVIEW
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Culoare Principală (Accent)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                <code style={{ fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '0.4rem', borderRadius: '4px' }}>{primaryColor}</code>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Culoare Fundal (Site)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={bgDarkColor} onChange={e => setBgDarkColor(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                <code style={{ fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '0.4rem', borderRadius: '4px' }}>{bgDarkColor}</code>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Culoare Carduri/Casete</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={bgCardColor} onChange={e => setBgCardColor(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                <code style={{ fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '0.4rem', borderRadius: '4px' }}>{bgCardColor}</code>
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span>Rotunjire Butoane</span>
                <span style={{ color: 'var(--primary)' }}>{btnRadius}px</span>
              </label>
              <input type="range" min="0" max="30" value={btnRadius} onChange={e => setBtnRadius(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            </div>
          </div>

          {/* Live Component Sample */}
          <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '16px', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Sample Componente</div>
            <button className="btn btn-primary">Rezervă Prima Ședință</button>
            <div className="action-btn-box" style={{ width: 'auto' }}>
              Acțiune Secundară
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', width: '100%', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
              Exemplu de Caseta (Card)
            </div>
          </div>

        </div>
      </div>

      {/* Guest Mode Banner */}
      {isGuest && (
        <div style={{ background: 'var(--primary)', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>🌟 {t.dashboard.guestMode}</span>
          <button className="btn" style={{ background: '#fff', color: 'var(--primary)', padding: '0.5rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, borderRadius: 'var(--radius-btn)' }} onClick={() => navigate('/onboarding')}>
            {t.dashboard.activateAlerts}
          </button>
        </div>
      )}

      {/* 1. Header & Actions */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Logo size={48} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{t.dashboard.title}</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>
              Bine ai revenit la cursuri! Energia ta e contagioasă.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.85rem', borderRadius: 'var(--radius-btn)' }}
            onClick={handleTestAlert}
            disabled={isTesting}
          >
            {isTesting ? 'Se trimite...' : t.dashboard.btnTestAlert}
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/pricing')}>
            {t.dashboard.addSite}
          </button>
        </div>
      </header>

      {/* 2. Metric Cards */}
      <div className="stats-summary-bar">
        <div className="dash-section" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem', background: 'rgba(239,68,68,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎟️</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">{t.dashboard.statChannels}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginTop: '0.2rem', color: 'var(--primary)' }}>{stats.sessionsLeft}</div>
          </div>
        </div>
        <div className="dash-section" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem', background: 'rgba(239,68,68,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🕺</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">{t.dashboard.statButtons}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginTop: '0.2rem' }}>{stats.activeCourses}</div>
          </div>
        </div>
        <div className="dash-section" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem', background: 'rgba(16,185,129,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✅</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">{t.dashboard.statAlerts}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1, marginTop: '0.2rem' }}>{stats.attendances}</div>
          </div>
        </div>
        <div className="dash-section" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem', background: 'rgba(249,115,22,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔥</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="label">{t.dashboard.statDaysSince}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginTop: '0.2rem', color: '#f97316' }}>{stats.daysToParty}</div>
          </div>
        </div>
      </div>

      {/* 3. Community Stats / Girl-Boy Balance */}
      <div className="dash-section">
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800 }}>
              {t.dashboard.leakTitle}
              <span className="badge" style={{ fontSize: '0.7rem' }}>SALA ACTUALĂ</span>
            </h3>
            <div style={{ fontSize: '1.5rem', color: 'var(--success)', fontWeight: 900, marginBottom: '1rem' }}>
              {t.dashboard.leakOk}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Monitorizăm în timp real numărul de înscrieri pentru a păstra un echilibru optim între fete și băieți la curs, asigurând cea mai buna experiență de învățare.
            </p>
          </div>

          <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>{t.dashboard.leakStep1}</span>
              <span style={{ fontWeight: 900, color: 'var(--primary)' }}>42</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--primary)' }}></div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span style={{ fontWeight: 700 }}>{t.dashboard.leakStep2}</span>
              <span style={{ fontWeight: 900, color: 'var(--accent)' }}>38</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', background: 'var(--accent)' }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Schedule Sharing */}
      <div className="dash-section" style={{ background: 'rgba(239, 68, 68, 0.05)', borderStyle: 'dashed' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>🔗 {t.dashboard.healthLinkTitle}</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vezi programul tău personalizat și progresul pe orice dispozitiv.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <code style={{ background: 'var(--bg-dark)', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid var(--border)', fontWeight: 600 }}>
              lovetodance.ro/status/elev-demo
            </code>
            <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-btn)' }} onClick={copyScheduleLink}>
              {copied ? t.dashboard.linkCopied : t.dashboard.copyLink}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div className="dash-section">
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 800 }}>{t.dashboard.tableTitle}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[
            { btn: 'Salsa', page: 'Level 1 - Figuri Intermediare', time: 'Aseară', icon: '💃', status: 'Prezent' },
            { btn: 'Bachata', page: 'Level 1 - Conexiune', time: '2 zile', icon: '🎵', status: 'Prezent' },
            { btn: 'Social Party', page: 'Club Salsa București', time: '5 zile', icon: '🎉', status: 'Prezent' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ fontSize: '1.8rem', width: '55px', height: '55px', borderRadius: '14px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{item.btn}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.page}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>{item.status}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
