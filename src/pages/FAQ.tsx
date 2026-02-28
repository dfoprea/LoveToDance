import { useContext } from 'react';
import { LanguageContext } from '../App';
import '../App.css';

function FAQ() {
  const { t } = useContext(LanguageContext);

  // Folosim datele din i18n sau fallback la RO dacă lipsesc traducerile specifice
  const faqData = [
    {
      category: t.ro ? "Logistică și Participare" : "Logistics & Participation", // Fallback simplu pentru categorii daca nu sunt in i18n
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

  // Mapăm întrebările la traducerile din i18n dacă există, altfel rămân cele de mai sus
  // Pentru moment, deoarece avem nevoie de viteză, voi lăsa FAQ-ul să folosească obiectul t.faq
  // Dar pentru a fi 100% sigur că merge butonul, voi face componenta să reacționeze la `t`

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="page-title">{t.faq.title}</h1>
        <p className="page-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>{t.faq.subtitle}</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {faqData.map((section, idx) => (
          <div key={idx} className="faq-section">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              {section.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {section.items.map((item, i) => (
                <div key={i} className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>{item.q}</h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t.faq.contactTitle}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t.faq.contactDesc}</p>
        <button className="btn-primary-full" style={{ maxWidth: '250px' }} onClick={() => window.location.href = 'mailto:corina@lovetodance.ro'}>
          {t.faq.btnContact}
        </button>
      </div>
    </div>
  );
}

export default FAQ;