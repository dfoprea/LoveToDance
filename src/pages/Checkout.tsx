import { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LanguageContext, ToastContext } from '../App';
import '../App.css';

function Checkout() {
  const { t } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedPlan = searchParams.get('plan') || 'Abonament LTD';
  const price = searchParams.get('price') || '220';

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [showCVVHelp, setShowCVVHelp] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Înscrierea ta la ${selectedPlan} a fost înregistrată! Te așteptăm la curs.`, 'success');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="page-container fade-in">
      <div className="checkout-grid">
        
        {/* LEFT: ORDER SUMMARY */}
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Finalizare Înscriere</h2>
          
          <div className="feature-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.2rem' }}>Pachet Ales</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{selectedPlan}</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{price} RON</div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Abonamentul tău îți oferă acces la cursurile alese conform programului și participarea la orele de practică.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Acces Cursuri</span>
                <span style={{ fontWeight: 700 }}>Inclus</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Ore Practică & Social</span>
                <span style={{ fontWeight: 700 }}>Gratuit</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, marginTop: '1rem', color: 'var(--text-main)' }}>
                <span>Total de plată</span>
                <span>{price} RON</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed #10b981', borderRadius: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>🔒</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Conexiune securizată SSL.</span>
          </div>
        </div>

        {/* RIGHT: PAYMENT FORM */}
        <div className="feature-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Informații Plată</h3>
          
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setPaymentMethod('card')} className="action-btn-box" style={{ flex: 1, border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)', background: paymentMethod === 'card' ? 'rgba(155,28,28,0.05)' : 'transparent', justifyContent: 'center' }}>💳 Card</button>
            <button onClick={() => setPaymentMethod('paypal')} className="action-btn-box" style={{ flex: 1, border: paymentMethod === 'paypal' ? '2px solid var(--primary)' : '1px solid var(--border)', background: paymentMethod === 'paypal' ? 'rgba(155,28,28,0.05)' : 'transparent', justifyContent: 'center' }}>🅿️ PayPal</button>
            <button onClick={() => setPaymentMethod('cash')} className="action-btn-box" style={{ flex: 1, border: paymentMethod === 'cash' ? '2px solid var(--primary)' : '1px solid var(--border)', background: paymentMethod === 'cash' ? 'rgba(155,28,28,0.05)' : 'transparent', justifyContent: 'center' }}>💵 Cash</button>
          </div>

          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Număr Card</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="social-input" style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Expirare</label>
                    <input required type="text" placeholder="MM / YY" className="social-input" />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      CVV 
                      <span onMouseEnter={() => setShowCVVHelp(true)} onMouseLeave={() => setShowCVVHelp(false)} onTouchStart={() => setShowCVVHelp(!showCVVHelp)} style={{ marginLeft: '0.5rem', cursor: 'help', color: 'var(--primary)' }}>ⓘ</span>
                    </label>
                    <input required type="password" placeholder="***" className="social-input" maxLength={3} />
                    {showCVVHelp && (
                      <div style={{ position: 'absolute', top: '-60px', right: 0, background: '#333', color: '#fff', padding: '0.5rem', borderRadius: '8px', fontSize: '0.7rem', width: '150px', zIndex: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                        Cele 3 cifre de pe spatele cardului tău.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'paypal' && (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p>Vei fi redirecționat către PayPal.</p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div style={{ padding: '1.5rem', background: 'rgba(155,28,28,0.05)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Achită direct la recepție (Cash sau Revolut).</p>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nume deținător card</label>
              <input required type="text" placeholder="NUME PRENUME" className="social-input" />
            </div>

            <button type="submit" className="btn-primary-full" style={{ marginTop: '1rem', padding: '1.2rem' }}>
              {paymentMethod === 'cash' ? 'RESERVĂ ACUM' : 'PLĂTEȘTE ÎN SIGURANȚĂ'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
