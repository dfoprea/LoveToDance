import { useState, useMemo } from 'react';
import '../App.css';

// --- AUTOMATIZARE DISCOVERY pentru Combinatii (Fixat Prod) ---
const courseAssets = import.meta.glob('../../public/Storage/Cursuri/**/*.{mp4,jpg,jpeg,png}', { 
  eager: true
});

const autoComboData = Object.entries(courseAssets).map(([path, module]: [string, any], index) => {
  const parts = path.split('/');
  const category = parts.length >= 2 ? parts[parts.length - 2] : 'Curs';
  const fileName = parts[parts.length - 1] || 'video';
  
  const rawUrl = typeof module === 'string' ? module : (module.default || '');
  const finalUrl = String(rawUrl).replace('/public', '').replace('../../public', '');
  
  const dateMatch = fileName.match(/^\[(\d{4}-\d{2}-\d{2})\]/);
  const dateStr = dateMatch ? dateMatch[1] : '2026-02-27';

  return {
    id: `combo-${index}`,
    title: fileName.replace(/^\[\d{4}-\d{2}-\d{2}\]\s*/, '').split('.')[0].replace(/_/g, ' ').replace(/WhatsApp Video \d+-\d+-\d+ at \d+.\d+.\d+/, 'LTD Combination'),
    url: finalUrl,
    category: category,
    date: dateStr,
    tags: [category.toLowerCase(), 'coregrafie'],
    isPublic: true
  };
});

function Combinations() {
  const [filter, setFilter] = useState('All');

  const filteredCombos = useMemo(() => {
    return autoComboData.filter(combo => filter === 'All' || combo.category === filter);
  }, [filter]);

  return (
    <div className="page-container fade-in" style={{ padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="hero-accent" style={{ fontSize: '2.5rem' }}>Arhiva Video</span>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Combinații & Cursuri</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          Exersează pașii învățați la curs. Aici găsești coregrafiile și elementele tehnice explicate, salvate pentru totdeauna.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <div className="filter-group-pro">
          <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>Toate</button>
          {[...new Set(autoComboData.map(c => c.category))].map(cat => (
            <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {filteredCombos.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {filteredCombos.map(combo => (
            <div key={combo.id} className="course-card-pro" style={{ padding: '1rem', borderRadius: '24px' }}>
              <div style={{ width: '100%', aspectRatio: '9 / 16', background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                <video 
                  src={combo.url} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800 }}>{combo.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{combo.date}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>{combo.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {combo.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Scanăm folderele pentru cursuri noi...</div>
      )}
    </div>
  );
}

export default Combinations;
