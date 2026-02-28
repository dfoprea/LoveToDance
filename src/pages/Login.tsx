import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext, AuthContext, ToastContext } from '../App';
import '../App.css';

function Login() {
  const { t } = useContext(LanguageContext);
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // LOGICA DE ACCES
    if (email === 'admin' && pass === 'admin') {
      login('Corina', 'admin');
      addToast('Bine ai revenit, Corina! Panoul de administrare este activ.', 'success');
      navigate('/dashboard');
    } else {
      // Simulam un student pentru orice alt input
      login(email.split('@')[0], 'student');
      addToast(`Bun venit la cursuri, ${email.split('@')[0]}!`, 'success');
      navigate('/');
    }
  };

  return (
    <div className="page-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="feature-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>{t.loginPage.title}</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email sau Utilizator</label>
            <input 
              id="login-email" 
              required 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin sau email@elev.com" 
              className="social-input"
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="login-pass" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.loginPage.pass}</label>
            <input 
              id="login-pass" 
              required 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••" 
              className="social-input"
            />
          </div>
          <button type="submit" className="btn-primary-full" style={{ marginTop: '0.5rem', padding: '1rem' }}>{t.loginPage.btn}</button>
        </form>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.loginPage.noAccount} <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>{t.loginPage.toSignup}</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
