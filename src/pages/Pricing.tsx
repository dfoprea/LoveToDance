import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import '../App.css';

function Pricing() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleCheckout = (plan: string, price: string) => {
    navigate(`/checkout?plan=${encodeURIComponent(plan)}&price=${price}`);
  };

  const PriceDisplay = ({ amount }: { amount: string }) => (
    <div style={{ 
      margin: '2rem 0', 
      display: 'inline-flex', 
      alignItems: 'baseline', 
      gap: '0.4rem',
      padding: '0.5rem 1.5rem',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{amount}</span>
      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ron</span>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.7 }}>/ lună</span>
    </div>
  );

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="page-title">{t.pricing.title}</h1>
        <p className="page-subtitle">{t.pricing.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Salsa & Bachata Card */}
        <div className="pricing-card" style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3rem 2.5rem' }}>
          <h3 className="plan-name" style={{ fontSize: '1.5rem' }}>{t.pricing.salsaTitle}</h3>
          
          <PriceDisplay amount="220" />

          <p className="plan-desc" style={{ fontSize: '0.95rem', marginBottom: '2rem', minHeight: '60px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {t.pricing.salsaDesc}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <ul className="plan-features" style={{ textAlign: 'left', fontSize: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> 2 Stiluri incluse (Salsa + Bachata)</li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> Ore de practică asistate</li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> Acces comunitate LTD Family</li>
            </ul>
          </div>

          <button className="btn-primary-full" onClick={() => handleCheckout(t.pricing.salsaTitle, '220')}>
            {t.pricing.btnEnroll}
          </button>
        </div>

        {/* Kizomba Card */}
        <div className="pricing-card" style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3rem 2.5rem' }}>
          <h3 className="plan-name" style={{ fontSize: '1.5rem' }}>{t.pricing.kizombaTitle}</h3>
          
          <PriceDisplay amount="250" />

          <p className="plan-desc" style={{ fontSize: '0.95rem', marginBottom: '2rem', minHeight: '60px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {t.pricing.kizombaDesc}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <ul className="plan-features" style={{ textAlign: 'left', fontSize: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> Curs specializat Kizomba</li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> Atenție personalizată pe tehnică</li>
              <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.6rem' }}><span>•</span> Ore de practică incluse</li>
            </ul>
          </div>

          <button className="btn-primary-full" onClick={() => handleCheckout(t.pricing.kizombaTitle, '250')}>
            {t.pricing.btnEnroll}
          </button>
        </div>

      </div>
      
      <div style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0 2rem' }}>
        <p>{t.pricing.freeTrial}</p>
        <p style={{ marginTop: '0.5rem' }}>{t.pricing.paymentInfo}</p>
      </div>
    </div>
  );
}

export default Pricing;