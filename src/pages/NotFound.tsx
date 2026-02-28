import { Link } from 'react-router-dom';
import { Logo } from '../App';
import '../App.css';

function NotFound() {
  return (
    <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Logo size={120} />
      </div>
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary)', fontWeight: 900 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Ups! Se pare că te-ai pierdut în pașii de dans.</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px' }}>
        Pagina pe care o cauți nu există, dar nu-ți face griji! Te putem ajuta să găsești drumul înapoi către ringul de dans.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem', textDecoration: 'none' }}>
        Înapoi la Cursuri
      </Link>
    </div>
  );
}

export default NotFound;
