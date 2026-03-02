import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Instructors from './pages/Instructors';
import Features from './pages/Features';
import FAQ from './pages/FAQ';
import Documentation from './pages/Documentation';
import GalleryHub from './pages/GalleryHub';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Demo from './pages/Demo';
import Dashboard from './pages/Dashboard';
import Combinations from './pages/Combinations';
import Checkout from './pages/Checkout';
import Status from './pages/Status';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { translations, type Language } from './i18n';
import './App.css';

// --- CONTEXTS ---
export const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: any;
}>({
  lang: 'ro',
  setLang: () => {},
  t: translations['ro']
});

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

export type ToastType = 'success' | 'error' | 'info';
export interface Toast { id: number; message: string; type: ToastType; }
export const ToastContext = createContext<{
  addToast: (msg: string, type: ToastType) => void;
}>({ addToast: () => {} });

export type UserRole = 'guest' | 'student' | 'admin';
export interface User { name: string; role: UserRole; }
export const AuthContext = createContext<{
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

// --- HELPERS ---
function ToastContainer({ toasts, remove }: { toasts: Toast[], remove: (id: number) => void }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
          <div className="toast-content">{t.message}</div>
          <div className="toast-progress"></div>
        </div>
      ))}
    </div>
  );
}

export function Logo({ size = 60 }) {
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000',
      border: '2px solid var(--primary)'
    }}>
      <img src="/Storage/LovetoDance_Logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

function Navigation() {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <Logo size={50} />
          <span className="branding-text">LovetoDance</span>
        </Link>
      </div>
      
      <nav className="nav-links" style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t.nav.home}</Link>
        <Link to="/instructors" className={location.pathname === '/instructors' ? 'active' : ''}>{t.nav.instructors}</Link>
        <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>{t.nav.classes}</Link>
        <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Tarife</Link>
        <Link to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>FAQ & Ghid</Link>
        <Link to="/combinations" className={location.pathname === '/combinations' ? 'active' : ''}>Combinații</Link>
        <Link to="/docs" className={location.pathname === '/docs' ? 'active' : ''}>{t.nav.schedule}</Link>
        <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>{t.nav.gallery}</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t.nav.contact}</Link>
      </nav>

      <div className="header-actions">
        <div className="action-btn-box" onClick={toggleTheme} style={{ width: '40px', justifyContent: 'center', padding: 0 }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </div>
        <div className="action-btn-box" style={{ padding: '0 0.5rem' }}>
          <select 
            className="lang-dropdown" 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer', fontWeight: 800 }}
          >
            <option value="ro">RO</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
          </select>
        </div>
        
        {user ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={user.role === 'admin' ? '/dashboard' : '/status/me'} className="btn-login" style={{ background: user.role === 'admin' ? 'var(--primary)' : '#333' }}>
              {user.role === 'admin' ? `⚙️ Admin` : `👤 ${user.name}`}
            </Link>
            <button onClick={logout} className="action-btn-box" style={{ padding: '0 1rem' }}>
              🚪 Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-login">
            👤 {t.nav.login}
          </Link>
        )}
      </div>
    </header>
  );
}

function SEOUpdater() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let title = "Love to Dance - Cursuri Salsa & Bachata București";
    let desc = "Școala de dans Love to Dance (LTD) din București. Cursuri de Salsa, Bachata și Kizomba pentru începători. Prima ședință este GRATUITĂ!";
    if (path === '/instructors') title = "Instructori - Love to Dance";
    else if (path === '/gallery') title = "Galerie Video & Foto - Love to Dance";
    else if (path === '/features') title = "Cursuri Dans - Love to Dance";
    else if (path === '/docs') title = "Program & Locație - Love to Dance";
    else if (path === '/contact') title = "Contact - Love to Dance";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [location]);
  return null;
}

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ltd_lang');
    return (saved as Language) || 'ro';
  });
  const [theme, setTheme] = useState('dark');

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('ltd_lang', newLang);
  };

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ltd_user');
    return saved ? JSON.parse(saved) : null;
  });

  const t = useMemo(() => translations[lang] || translations['ro'], [lang]);

  const login = (name: string, role: UserRole) => {
    const newUser = { name, role };
    setUser(newUser);
    localStorage.setItem('ltd_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ltd_user');
  };

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      <ToastContext.Provider value={{ addToast }}>
        <AuthContext.Provider value={{ user, login, logout }}>
          <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark') }}>
            <Router>
              <SEOUpdater />
              <ScrollToTop />
              <div className="app-container">
                <a href="#main-content" className="skip-link">Sari la conținutul principal</a>
                <Navigation />
                <main id="main-content" className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/instructors" element={<Instructors />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/docs" element={<Documentation />} />
                    <Route path="/gallery" element={<GalleryHub />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/combinations" element={<Combinations />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/status/:storeId" element={<Status />} />
                    <Route path="/privacy" element={<Legal />} />
                    <Route path="/terms" element={<Legal />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <ToastContainer toasts={toasts} remove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
                <footer className="footer">
                  <div className="footer-content">
                    <div className="footer-brand">
                      <div className="logo-container" style={{ marginBottom: '1rem' }}>
                        <Logo size={70} />
                        <span className="branding-text" style={{ fontSize: '1.2rem' }}>LovetoDance</span>
                      </div>
                      <p>{t.footer.tagline}</p>
                    </div>
                    <div className="footer-links-container">
                      <div className="footer-column">
                        <h4>{t.footer.product}</h4>
                        <Link to="/features">{t.nav.classes}</Link>
                        <Link to="/pricing">{t.nav.pricing}</Link>
                        <Link to="/docs">{t.nav.schedule}</Link>
                      </div>
                      <div className="footer-column">
                        <h4>{t.footer.company}</h4>
                        <Link to="/contact">{t.nav.contact}</Link>
                        <Link to="/dashboard" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin Dashboard</Link>
                      </div>
                      <div className="footer-column">
                        <h4>{t.footer.legal}</h4>
                        <Link to="/privacy">{t.footer.privacy}</Link>
                        <Link to="/terms">{t.footer.terms}</Link>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </Router>
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
