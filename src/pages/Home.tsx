import { useContext, useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Heart, Users, Star, ArrowRight, Play, Camera, Share2, Facebook, MessageSquare, Link as LinkIcon, Instagram, Music2 } from 'lucide-react';
import { LanguageContext, ToastContext, AuthContext } from '../App';
import '../App.css';

// 1. SCANARE AUTOMATĂ pentru Home (Fixat pentru Prod)
const homeAssets = import.meta.glob('../../public/Storage/Acasa/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

function Home() {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const [socialData, setSocialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('ltd_social_data', JSON.stringify(socialData));
  }, [socialData]);

  const heroVideoId = 'hero-main-video';
  const heroData = socialData[heroVideoId] || { likes: 154, likedBy: [] };
  const isLikedByMe = (heroData.likedBy || []).includes(user?.id || 'guest-session');

  const handleLike = () => {
    const userId = user?.id || 'guest-session';
    const likedBy = heroData.likedBy || [];
    const isLiked = likedBy.includes(userId);

    const newLikedBy = isLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId];
    const newLikes = (heroData.likes || 0) + (isLiked ? -1 : 1);

    setSocialData((prev: any) => ({
      ...prev,
      [heroVideoId]: { ...heroData, likes: newLikes, likedBy: newLikedBy }
    }));

    if (!isLiked) addToast('❤️ Bucuroși că îți place!', 'info');
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.origin;
    const message = `Vino și tu la Love2Dance! Vezi atmosfera de aici: ${shareUrl}`;

    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'instagram' || platform === 'tiktok' || platform === 'copy') { 
      navigator.clipboard.writeText(shareUrl); 
      addToast(platform === 'copy' ? 'Link site copiat!' : `Link copiat pentru ${platform.charAt(0).toUpperCase() + platform.slice(1)}! ✅`, 'success'); 
    }
    setShowShareMenu(false);
  };

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

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 1. Hero Section with Video */}
      <section className="hero-video-container" style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          className="hero-video"
          onDoubleClick={handleLike}
          style={{
            pointerEvents: 'auto',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            width: '100vw',
            height: '90vh',
            zIndex: 1,
            opacity: 0.85,
            cursor: 'pointer'
          }}
        >
          <source src="/Storage/Acasa/videos/hero_bg.mp4" type="video/mp4" />
        </video>

        {/* HERO INTERACTION BAR */}
        <div className="media-interaction-bar" style={{ zIndex: 20, right: '2rem' }}>
          <div className={`interaction-item ${isLikedByMe ? 'liked' : ''}`} onClick={handleLike}>
            <div className="interaction-btn">
              <Heart size={24} fill={isLikedByMe ? "currentColor" : "none"} />
            </div>
            <span className="interaction-count">{heroData.likes || 0}</span>
          </div>

          <div className="interaction-item" style={{ position: 'relative' }}>
            <div className="interaction-btn" onClick={() => setShowShareMenu(!showShareMenu)}>
              <Share2 size={24} />
            </div>
            <span className="interaction-count">Share</span>
            <AnimatePresence>
              {showShareMenu && (
                <motion.div 
                  className="share-menu-floating"
                  style={{ bottom: '0', right: '60px' }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <button className="share-option" onClick={() => handleShare('whatsapp')} title="WhatsApp"><MessageSquare size={18} /></button>
                  <button className="share-option" onClick={() => handleShare('facebook')} title="Facebook"><Facebook size={18} /></button>
                  <button className="share-option" onClick={() => handleShare('instagram')} title="Instagram"><Instagram size={18} /></button>
                  <button className="share-option" onClick={() => handleShare('tiktok')} title="TikTok"><Music2 size={18} /></button>
                  <button className="share-option" onClick={() => handleShare('copy')} title="Copy Link"><LinkIcon size={18} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hero-overlay" style={{ zIndex: 2, background: 'rgba(0, 0, 0, 0.5)', pointerEvents: 'none' }}></div>
        <div className="hero-content" style={{ zIndex: 10, position: 'relative', marginTop: '-5vh', pointerEvents: 'none' }}>
          <motion.span 
            className="hero-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}
          >
            LoveToDance
          </motion.span>          <motion.h1 
            className="hero-title-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Dance your way <br /> 
            <span style={{ color: 'var(--primary)', textShadow: '0 0 20px rgba(155, 28, 28, 0.5)' }}>through life</span>
          </motion.h1>
          <motion.p 
            className="hero-subtitle-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t.home.heroSubtitle}
          </motion.p>
          <motion.div 
            className="cta-group" 
            style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="btn btn-primary btn-glow" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/contact')}>
              {t.home.heroBtnPrimary} <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/features')}>
              <Play size={20} /> {t.home.heroBtnSecondary}
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. "Two Left Feet" Section */}
      <section className="page-container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <motion.div 
          style={{ maxWidth: '800px', margin: '0 auto' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="hero-accent" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>{t.home.twoLeftFeetTitle}</motion.span>
          <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{t.home.twoLeftFeetSubtitle}</motion.h2>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            {t.home.twoLeftFeetDesc}
          </motion.p>
          
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleUp} style={{ padding: '2rem', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} className="feature-card">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Heart size={24} />
              </div>
              <img src={featureImages[0] || "/LTD Banner.jpg"} alt="Fara Partener" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>{t.home.feature1Title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{t.home.feature1Desc}</p>
            </motion.div>

            <motion.div variants={scaleUp} style={{ padding: '2rem', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} className="feature-card">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Star size={24} />
              </div>
              <img src={featureImages[1] || "/LTD Banner.jpg"} alt="De la Zero" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>{t.home.feature2Title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{t.home.feature2Desc}</p>
            </motion.div>

            <motion.div variants={scaleUp} style={{ padding: '2rem', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} className="feature-card">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <img src={featureImages[2] || "/LTD Banner.jpg"} alt="Comunitate" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>{t.home.feature3Title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{t.home.feature3Desc}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Social Wall Section */}
      <section style={{ padding: '8rem 2rem', background: 'linear-gradient(to bottom, var(--bg-dark), #150505, var(--bg-dark))' }}>
        <motion.div 
          className="page-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{t.home.socialTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.home.socialSubtitle}</p>
          </motion.div>
          
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
            variants={staggerContainer}
          >
            <motion.a 
              href="https://www.instagram.com/love_to_dance_bucharest/" target="_blank" rel="noopener noreferrer" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              variants={scaleUp}
            >
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', border: 'none', borderRadius: 'var(--radius-card)', position: 'relative', overflow: 'hidden' }}>
                <Camera size={64} color="rgba(255,255,255,0.9)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>Instagram</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>@love_to_dance_bucharest</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2.5rem', background: '#fff', color: '#bc1888', borderRadius: '99px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={18} /> Follow Us
                </div>
              </div>
            </motion.a>
            <motion.a 
              href="https://www.tiktok.com/@love_to_dance_bucharest" target="_blank" rel="noopener noreferrer" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              variants={scaleUp}
            >
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', border: '1px solid rgba(37, 244, 238, 0.3)', borderRadius: 'var(--radius-card)', boxShadow: '0 0 30px rgba(37, 244, 238, 0.1)' }}>
                <Play size={64} color="#25f4ee" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>TikTok</h3>
                <p style={{ color: '#25f4ee', fontWeight: 700 }}>@love_to_dance_bucharest</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2.5rem', background: '#fe2c55', color: '#fff', borderRadius: '99px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} /> Watch Trends
                </div>
              </div>
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/groups/lovetodanceltd" target="_blank" rel="noopener noreferrer" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              variants={scaleUp}
            >
              <div className="course-card-pro" style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #1877F2 0%, #0e5a20 100%)', border: 'none', borderRadius: 'var(--radius-card)' }}>
                <Share2 size={64} color="rgba(255,255,255,0.9)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>Facebook</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>LTD Family Group</p>
                <div style={{ marginTop: '2rem', padding: '0.8rem 2.5rem', background: '#fff', color: '#1877F2', borderRadius: '99px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} /> Join Family
                </div>
              </div>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Schedule Snapshot */}
      <section className="schedule-banner-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="schedule-banner-overlay" style={{ background: 'linear-gradient(135deg, rgba(15,15,17,0.95) 0%, rgba(155, 28, 28, 0.8) 100%)' }}></div>
        <motion.div 
          className="page-container schedule-banner-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <motion.h2 variants={fadeInUp} style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', fontWeight: 900, color: '#fff' }}>{t.home.scheduleTitle}</motion.h2>
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'rgba(26,26,30,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={20} color="var(--primary)" />
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>Salsa & Bachata</h3>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>Luni & Miercuri</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>19:00 - 20:00</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Începători</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>20:00 - 21:00</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Intermediari</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'rgba(26,26,30,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={20} color="var(--primary)" />
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>Kizomba</h3>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>Marți & Joi</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>19:30 - 20:30</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Toate nivelurile</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="course-card-pro" style={{ borderRadius: 'var(--radius-card)', background: 'rgba(26,26,30,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(155, 28, 28, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color="var(--primary)" />
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>Social Party</h3>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>Sâmbătă</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>21:00</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Până dimineața</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4.5. Galerie CTA */}
      <section className="page-container" style={{ padding: '2rem 2rem 6rem', textAlign: 'center' }}>
        <motion.div 
          style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(145deg, rgba(26,26,30,1) 0%, rgba(15,15,17,1) 100%)', padding: '4rem 2rem', borderRadius: 'var(--radius-card)', border: '1px solid rgba(155, 28, 28, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Camera size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Surprinde Magia Dansului</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Bucură-te de momentele noastre speciale! Aruncă o privire peste energia din timpul cursurilor, de la petrecerile sociale și din festivaluri.
            </p>
            <button className="btn btn-primary btn-glow" onClick={() => navigate('/gallery')} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={20} fill="currentColor" /> Explorează Galeria
            </button>
          </div>
        </motion.div>
      </section>

      {/* 5. Google Maps Location */}
      <motion.section 
        className="map-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <iframe 
          title="Locatie Love to Dance"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2849.526279934335!2d26.115867315525!3d44.42234097910243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff3c43653163%3A0xf6a65526868d447a!2sSplaiul%20Unirii%20162%2C%20Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1625000000000!5m2!1sro!2sro" 
          allowFullScreen 
          loading="lazy"
          style={{ filter: 'grayscale(0.5) contrast(1.2)' }}
        ></iframe>
      </motion.section>
    </motion.div>
  );
}

export default Home;