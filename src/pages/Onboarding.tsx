import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

function Onboarding() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [experience, setExperience] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('scanning');
    
    setTimeout(() => {
      setStep('results');
    }, 2000);
  };

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id) 
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate('/dashboard?guest=true');
  };

  const recommendedCourses = [
    { id: 'c1', label: t.onboarding.mockBtn1, time: 'Marți & Joi, 20:00 (Corina & Mickey)', icon: '💃' },
    { id: 'c2', label: t.onboarding.mockBtn2, time: 'Luni & Miercuri, 19:00 (Claudia & Florin)', icon: '🕺' },
    { id: 'c3', label: t.onboarding.mockBtn3, time: 'Luni & Miercuri, 20:00 (Anca & Cristi)', icon: '✨' },
    { id: 'c4', label: t.onboarding.mockBtn4, time: 'La cerere', icon: '👰' },
    { id: 'c5', label: t.onboarding.mockBtn5, time: 'Program flexibil', icon: '⭐' },
  ];

  return (
    <div className="page-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      
      {step === 'idle' && (
        <div className="feature-card" style={{ width: '100%', maxWidth: '550px', textAlign: 'center', padding: '3rem' }}>
          <div className="feature-icon" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✨</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: 900 }}>{t.onboarding.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{t.onboarding.subtitle}</p>
          
          <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label htmlFor="exp-input" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>{t.onboarding.website}</label>
              <select 
                id="exp-input"
                required 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1.2rem', 
                  borderRadius: '12px', 
                  border: '2px solid var(--border)', 
                  background: 'var(--bg-card)', 
                  color: 'var(--text-main)', // Fix for white on white
                  fontSize: '1.1rem', 
                  fontWeight: 600 
                }} 
              >
                <option value="" style={{ color: 'var(--text-muted)' }}>Alege o variantă...</option>
                <option value="none" style={{ color: 'var(--text-main)' }}>Sunt începător absolut, nu am mai dansat</option>
                <option value="some" style={{ color: 'var(--text-main)' }}>Am mai făcut câteva cursuri în trecut</option>
                <option value="active" style={{ color: 'var(--text-main)' }}>Dansez activ de cel puțin 6 luni</option>
                <option value="pro" style={{ color: 'var(--text-main)' }}>Sunt dansator avansat / profesionist</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.2rem' }}>
              {t.onboarding.btn}
            </button>
          </form>
        </div>
      )}

      {step === 'scanning' && (
        <div className="feature-card fade-in" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '5rem 2rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 2.5rem auto', width: '70px', height: '70px', border: '5px solid rgba(239, 68, 68, 0.1)', borderLeftColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.onboarding.scanning}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem' }}>Căutăm cea mai potrivită grupă pentru tine la LoveToDance...</p>
        </div>
      )}

      {step === 'results' && (
        <div className="feature-card fade-in" style={{ width: '100%', maxWidth: '650px', padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎉</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{t.onboarding.scanComplete}</h2>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.onboarding.selectButtons}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {recommendedCourses.map((course) => {
              const isSelected = selectedCourses.includes(course.id);
              return (
                <button 
                  key={course.id} 
                  type="button"
                  onClick={() => toggleCourse(course.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textAlign: 'left',
                    gap: '1.25rem', 
                    padding: '1.25rem', 
                    background: isSelected ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)', 
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`, 
                    borderRadius: '16px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '100%'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{course.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {course.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{course.time}</div>
                  </div>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '8px', 
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isSelected && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleContinue} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem' }}
            disabled={selectedCourses.length === 0}
          >
            {t.onboarding.btnContinue}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Onboarding;
