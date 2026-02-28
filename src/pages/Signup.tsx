import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

function Signup() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Aici se va face in viitor crearea contului in backend
    navigate('/dashboard'); // Redirectioneaza spre dashboard dupa signup
  }

  return (
    <div className="page-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="feature-card" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{t.signupPage.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>{t.signupPage.subtitle}</p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="signup-email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.signupPage.email}</label>
            <input id="signup-email" required type="email" placeholder="hello@store.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', outline: 'none' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="signup-pass" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.signupPage.pass}</label>
            <input id="signup-pass" required type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', outline: 'none' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="signup-pass-confirm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.signupPage.passConfirm}</label>
            <input id="signup-pass-confirm" required type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', outline: 'none' }} />
          </div>
          <button type="submit" className="btn btn-primary-full" style={{ marginTop: '0.5rem' }}>{t.signupPage.btn}</button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.signupPage.hasAccount} <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>{t.signupPage.toLogin}</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
