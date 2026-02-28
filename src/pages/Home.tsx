import { useContext, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Home (Fixat pentru Prod)
const homeAssets = import.meta.glob('../../public/Storage/Acasa/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function Home() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extragem imaginile pentru casetele de incepatori (Fixat pentru Prod)
  const featureImages = useMemo(() => {
    return Object.entries(homeAssets)
      .filter(([path]) => !path.includes('hero_bg') && !path.toLowerCase().endsWith('.mp4'))
      .map(([_, module]: [string, any]) => {
        const rawUrl = typeof module === 'string' ? module : (module.default || '');
        return String(rawUrl).replace('/public', '').replace('../../public', '');
      });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay blocked or video error:", error);
      });
    }
  }, []);

  return (
    <div className="fade-in">
      {/* 1. Hero Section with Video */}
      <section className="hero-video-container" style={{ background: '#000' }}>
        <video 
          ref={videoRef}
          muted 
          loop 
          playsInline
          autoPlay
          className="hero-video"
          style={{ 
            pointerEvents: 'none', 
            objectFit: 'cover',
            objectPosition: 'center 30%', 
            width: '100vw',
            height: '90vh',
            zIndex: 1
          }}
        >
          <source src="/Storage/Acasa/videos/hero_bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" style={{ zIndex: 2 }}></div>
        <div className="hero-content" style={{ zIndex: 10 }}>
          <span className="hero-accent">Love to Dance</span>
          <h1 className="hero-title-main">
            Dance your way <br /> 
            <span style={{ color: 'var(--primary)' }}>through life</span>
          </h1>
          <p className="hero-subtitle-new">
            {t.home.heroSubtitle}
          </p>
          <div className="cta-group" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-glow" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={() => navigate('/contact')}>
              {t.home.heroBtnPrimary}
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={() => navigate('/features')}>
              {t.home.heroBtnSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* 2. "Two Left Feet" Section */}
      <section className="page-container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="hero-accent" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t.home.twoLeftFeetTitle}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{t.home.twoLeftFeetSubtitle}</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            {t.home.twoLeftFeetDesc}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <img src={featureImages[0] || "/LTD Banner.jpg"} alt="Fara Partener" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>{t.home.feature1Title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.home.feature1Desc}</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <img src={featureImages[1] || "/LTD Banner.jpg"} alt="De la Zero" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>{t.home.feature2Title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.home.feature2Desc}</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <img src={featureImages[2] || "/LTD Banner.jpg"} alt="Comunitate" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>{t.home.feature3Title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.home.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Wall Section */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(to bottom, var(--bg-dark), #1a0505)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{t.home.socialTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.home.socialSubtitle}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <a href="https://www.instagram.com/love_to_dance_bucharest/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none', borderRadius: 'var(--radius-card)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>Instagram</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>@love_to_dance_bucharest</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: '#fff', color: '#bc1888', borderRadius: '99px', fontWeight: 800 }}>Follow Us</div>
              </div>
            </a>
            <a href="https://www.tiktok.com/@love_to_dance_bucharest" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', border: '1px solid #25f4ee', borderRadius: 'var(--radius-card)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>TikTok</h3>
                <p style={{ color: '#25f4ee', fontWeight: 700 }}>@love_to_dance_bucharest</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: '#fe2c55', color: '#fff', borderRadius: '99px', fontWeight: 800 }}>Watch Trends</div>
              </div>
            </a>
            <a href="https://www.facebook.com/groups/lovetodanceltd" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#1877F2', border: 'none', borderRadius: 'var(--radius-card)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>Facebook</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>LTD Family Group</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: '#fff', color: '#1877F2', borderRadius: '99px', fontWeight: 800 }}>Join Family</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Schedule Snapshot with Banner Background */}
      <section className="schedule-banner-section">
        <div className="schedule-banner-overlay"></div>
        <div className="page-container schedule-banner-content">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', fontWeight: 800, color: '#fff' }}>{t.home.scheduleTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'var(--bg-card)' }}>
              <h3 style={{ color: 'var(--primary)' }}>Salsa & Bachata</h3>
              <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Luni & Miercuri</p>
              <p style={{ color: 'var(--text-muted)' }}>19:00 - 20:00 (Începători)</p>
              <p style={{ color: 'var(--text-muted)' }}>20:00 - 21:00 (Intermediari)</p>
            </div>
            <div className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'var(--bg-card)' }}>
              <h3 style={{ color: 'var(--primary)' }}>Kizomba</h3>
              <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Marți & Joi</p>
              <p style={{ color: 'var(--text-muted)' }}>19:30 - 20:30</p>
            </div>
            <div className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'var(--bg-card)' }}>
              <h3 style={{ color: 'var(--primary)' }}>Social Party</h3>
              <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>Sâmbătă</p>
              <p style={{ color: 'var(--text-muted)' }}>21:00 - Până dimineața</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Google Maps Location */}
      <section className="map-container">
        <iframe 
          title="Locatie Love to Dance"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.526279934335!2d26.115867315525!3d44.42234097910243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff3c43653163%3A0xf6a65526868d447a!2sSplaiul%20Unirii%20162%2C%20Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1625000000000!5m2!1sro!2sro" 
          allowFullScreen 
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default Home;
