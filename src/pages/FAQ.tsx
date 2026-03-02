import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import '../App.css';

function FAQ() {
  const { t } = useContext(LanguageContext);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: t.ro ? "Logistică și Participare" : "Logistics & Participation",
      items: [
        {
          q: "Am nevoie de partener pentru cursurile de dans?",
          a: "Nu este obligatoriu. Nu e nevoie să vii cu partener la cursurile Love to Dance din București. Perechile se schimbă la fiecare exercițiu, astfel încât fiecare să câștige experiență în a dansa cu oricine."
        },
        {
          q: "Ce încălțăminte și haine sunt necesare?",
          a: "Pentru prima ședință sunt suficiente o pereche de încălțăminte comodă de schimb (curată), destinată exclusiv sălii de dans, și haine în care te poți mișca liber."
        },
        {
          q: "Cine poate participa la cursuri și care este nivelul?",
          a: "Avem cursuri atât pentru începători absoluți, cât și grupe de intermediari. Deși locația noastră este aici (Timpuri Noi), avem elevi din tot Bucureștiul care ne aleg pentru calitatea instructorilor noștri."
        }
      ]
    },
    {
      category: "Lexicon Dans",
      items: [
        {
          q: "Ce înseamnă Salsa LA Style (Salsa pe 1)?",
          a: "Salsa LA Style este un stil de dans dinamic, dansat în linie, caracterizat prin figuri spectaculoase, viteză și energie ridicată."
        },
        {
          q: "Ce este Bachata Sensual & Moderna?",
          a: "Bachata este un dans originar din Republica Dominicană. Noi predăm stilurile Sensual și Moderna, care se concentrează pe conexiune, mișcări fluide ale corpului și muzicalitate."
        },
        {
          q: "Ce este Kizomba?",
          a: "Kizomba este un dans originar din Angola, caracterizat printr-o conexiune foarte apropiată între parteneri, mișcări lente, fluide și o tehnică precisă de leading și following."
        }
      ]
    },
    {
      category: "Comunitate și Experiență",
      items: [
        {
          q: "Cine sunt instructorii Love to Dance?",
          a: "Echipa este formată din instructori dedicați, coordonați de Corina (fondator cu 20 de ani de experiență). Mulți dintre instructorii noștri sunt dansatori de nivel competițional, cu prezențe la numeroase festivaluri."
        },
        {
          q: "Există oportunități de a exersa în afara orelor?",
          a: 'Da. Organizăm periodic "Timp pentru dans" - sesiuni gratuite în weekend pentru elevii școlii (începători/intermediari) pentru a exersa pașii învățați într-un mediu sigur.'
        },
        {
          q: "Se organizează ieșiri în oraș sau tabere?",
          a: "Absolut. Comunitatea LTD participă lunar la ieșiri în cluburi de social dancing (Rio, Preoteasa), petreceri tematice, tabere la munte/mare și festivaluri naționale (Brașov, Vama Veche, Cluj)."
        }
      ]
    }
  ];

  return (
    <motion.div 
      className="page-container fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}
    >
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="page-title">{t.faq.title}</h1>
        <p className="page-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>{t.faq.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {faqData.map((section, sIdx) => (
          <div key={sIdx} className="faq-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              {section.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {section.items.map((item, i) => {
                const globalIndex = sIdx * 100 + i;
                const isOpen = openIndex === globalIndex;
                
                return (
                  <motion.div 
                    key={i} 
                    className="feature-card" 
                    style={{ padding: 0, border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      style={{ width: '100%', textAlign: 'left', padding: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      {item.q}
                      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', color: 'var(--primary)' }}>▼</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {item.a}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t.faq.contactTitle}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t.faq.contactDesc}</p>
        <motion.button 
          className="btn-primary-full" 
          style={{ maxWidth: '250px' }} 
          onClick={() => window.location.href = 'mailto:corina@lovetodance.ro'}
        >
          {t.faq.btnContact}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FAQ;