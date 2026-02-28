import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import '../App.css';

function Demo() {
  const { t } = useContext(LanguageContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">{t.demo.title}</h1>
        <p className="page-subtitle">{t.demo.subtitle}</p>
      </div>

      <div className="dashboard-preview" style={{ margin: '0 auto', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
        <div className="dash-header" style={{ background: '#000', height: '50px' }}>
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
          <span className="dash-title-small" style={{ color: '#fff', opacity: 0.6 }}>PREVIEW_VIDEO_042.MP4</span>
        </div>
        <div className="dash-body" style={{ minHeight: '450px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          
          {progress < 100 ? (
            <div style={{ textAlign: 'center' }}>
              <div className="loading-spinner" style={{ width: '60px', height: '60px', border: '4px solid rgba(239, 68, 68, 0.2)', borderLeftColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }}></div>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>{t.demo.status} {progress}%</div>
            </div>
          ) : (
            <div className="fade-in" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'url("https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=1200") center/cover no-repeat' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '90px', height: '90px', background: 'rgba(239, 68, 68, 0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', color: '#fff' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Salsa LA Style - Grupa de Seară</h3>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontWeight: 600 }}>Vino să simți energia și bucuria dansului alături de noi!</p>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <a href="/onboarding" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.3rem' }}>Vreau să particip și eu!</a>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Demo;
