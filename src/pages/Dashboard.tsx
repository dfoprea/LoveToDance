import { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext, Logo, ToastContext, AuthContext } from '../App';
import { Heart, MessageCircle, Tag, Palette, FileText, Video, Trash2, Save, RotateCcw, Search, ChevronRight } from 'lucide-react';
import '../App.css';

function Dashboard() {
  const { t, lang } = useContext(LanguageContext);
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'theme' | 'content' | 'social' | 'media'>('theme');

  // PROTECTIE: Daca nu e admin, trimitem la login
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      addToast('Acces refuzat! Te rugăm să te autentifici ca administrator.', 'error');
      navigate('/login');
    }
  }, [user, navigate, addToast]);

  // --- 1. THEME MANAGEMENT ---
  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem('ltd_custom_theme');
    return saved ? JSON.parse(saved) : {
      primary: '#9b1c1c',
      bgDark: '#0f0f11',
      bgCard: '#1a1a1e',
      textMain: '#f8fafc',
      btnRadius: 10,
      cardRadius: 16
    };
  });

  const updateTheme = (key: string, value: string | number) => {
    const newConfig = { ...themeConfig, [key]: value };
    setThemeConfig(newConfig);
    localStorage.setItem('ltd_custom_theme', JSON.stringify(newConfig));
    
    // Apply live
    const root = document.documentElement;
    const cssKey = key === 'btnRadius' ? '--radius-btn' : 
                   key === 'cardRadius' ? '--radius-card' : 
                   `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    
    root.style.setProperty(cssKey, typeof value === 'number' ? `${value}px` : value);
  };

  const resetTheme = () => {
    localStorage.removeItem('ltd_custom_theme');
    window.location.reload();
  };

  // --- 2. CONTENT MANAGEMENT (TEXTS) ---
  const [editingTexts, setEditingTexts] = useState<any>(() => {
    const saved = localStorage.getItem(`ltd_texts_override_${lang}`);
    return saved ? JSON.parse(saved) : {};
  });

  const saveTextOverride = (section: string, key: string, value: string) => {
    const newOverrides = { ...editingTexts };
    if (!newOverrides[section]) newOverrides[section] = {};
    newOverrides[section][key] = value;
    
    setEditingTexts(newOverrides);
    localStorage.setItem(`ltd_texts_override_${lang}`, JSON.stringify(newOverrides));
    addToast('Text actualizat local! (Necesită refresh pentru aplicare totală)', 'success');
  };

  // --- 3. SOCIAL HUB MANAGEMENT ---
  const [socialData, setSocialData] = useState(() => {
    try {
      const saved = localStorage.getItem('ltd_social_data');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const deleteComment = (mediaId: string, commentIndex: number) => {
    const newData = { ...socialData };
    if (newData[mediaId]?.comments) {
      newData[mediaId].comments.splice(commentIndex, 1);
      setSocialData(newData);
      localStorage.setItem('ltd_social_data', JSON.stringify(newData));
      addToast('Comentariu șters!', 'info');
    }
  };

  const removeSocialTag = (mediaId: string, tag: string) => {
    const newData = { ...socialData };
    if (newData[mediaId]?.tags) {
      newData[mediaId].tags = newData[mediaId].tags.filter((t: string) => t !== tag);
      setSocialData(newData);
      localStorage.setItem('ltd_social_data', JSON.stringify(newData));
      addToast('Tag eliminat!', 'info');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <aside style={{ width: '250px', position: 'sticky', top: '100px' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Logo size={40} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>LTD Admin</h2>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'theme', label: 'Theme Builder', icon: <Palette size={18} /> },
              { id: 'content', label: 'Texte Pagini', icon: <FileText size={18} /> },
              { id: 'social', label: 'Social Hub', icon: <MessageCircle size={18} /> },
              { id: 'media', label: 'Media Library', icon: <Video size={18} /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', gap: '1rem', padding: '0.8rem 1.2rem', width: '100%' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ marginTop: '3rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Logged in as</div>
            <div style={{ fontWeight: 800 }}>{user.name} (Admin)</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          <AnimatePresence mode="wait">
            
            {/* --- TAB: THEME --- */}
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Theme Builder" subtitle="Control vizual complet peste culorile și formele site-ului." />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="feature-card" style={{ padding: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={16} /> Culori de Sistem</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <ColorInput label="Culoare Accent (Brand)" value={themeConfig.primary} onChange={v => updateTheme('primary', v)} />
                      <ColorInput label="Fundal Site" value={themeConfig.bgDark} onChange={v => updateTheme('bgDark', v)} />
                      <ColorInput label="Fundal Carduri" value={themeConfig.bgCard} onChange={v => updateTheme('bgCard', v)} />
                      <ColorInput label="Text Principal" value={themeConfig.textMain} onChange={v => updateTheme('textMain', v)} />
                    </div>

                    <h4 style={{ margin: '2rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><RotateCcw size={16} /> Forme & Structură</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <RangeInput label="Rotunjire Butoane" value={themeConfig.btnRadius} min={0} max={30} onChange={v => updateTheme('btnRadius', v)} />
                      <RangeInput label="Rotunjire Carduri" value={themeConfig.cardRadius} min={0} max={40} onChange={v => updateTheme('cardRadius', v)} />
                    </div>

                    <button onClick={resetTheme} className="btn-secondary" style={{ marginTop: '2rem', width: '100%', border: '1px dashed var(--primary)' }}>
                      Resetare la Valorile din Cod
                    </button>
                  </div>

                  <div style={{ position: 'sticky', top: '100px' }}>
                    <h4 style={{ marginBottom: '1rem', opacity: 0.6 }}>Live Preview Sample</h4>
                    <div style={{ background: 'var(--bg-dark)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
                      <span className="hero-accent" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>Love2Dance Preview</span>
                      <h3 style={{ marginBottom: '2rem' }}>Exemplu de Titlu Secțiune</h3>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        <button className="btn btn-primary">Buton Principal</button>
                        <button className="btn btn-secondary">Buton Secundar</button>
                      </div>
                      <div className="feature-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.7rem' }}>BADGE TEXT</div>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Acesta este un card de conținut pentru a testa contrastul culorilor.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB: CONTENT --- */}
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader title="Gestiune Texte" subtitle={`Editează textele de pe site pentru limba curentă (${lang.toUpperCase()}).`} />
                
                <div className="feature-card" style={{ padding: '2rem' }}>
                  {Object.entries(t).map(([section, keys]: [string, any]) => (
                    typeof keys === 'object' && (
                      <details key={section} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--primary)' }}>
                          Secțiunea: {section}
                        </summary>
                        <div style={{ padding: '1.5rem 0', display: 'grid', gap: '1rem' }}>
                          {Object.entries(keys).map(([key, value]: [string, any]) => (
                            typeof value === 'string' && (
                              <div key={key}>
                                <label style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', marginBottom: '0.3rem' }}>{key}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <textarea 
                                    defaultValue={editingTexts[section]?.[key] || value}
                                    onBlur={(e) => saveTextOverride(section, key, e.target.value)}
                                    style={{ flex: 1, background: 'var(--bg-dark)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', color: '#fff', fontSize: '0.9rem', minHeight: '60px' }}
                                  />
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </details>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- TAB: SOCIAL --- */}
            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader title="Social Hub Moderator" subtitle="Administrează comentariile și tag-urile adăugate de comunitate." />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {Object.entries(socialData).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Nu există încă activitate socială pe site.</div>
                  ) : (
                    Object.entries(socialData).map(([mediaId, data]: [string, any]) => (
                      <div key={mediaId} className="feature-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>MEDIA ID</div>
                            <code style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mediaId}</code>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>{data.likes || 0} Likes</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                          {/* Comments Mod */}
                          <div>
                            <h5 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageCircle size={14} /> Comentarii ({(data.comments || []).length})</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                              {(data.comments || []).map((c: any, i: number) => (
                                <div key={i} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <strong style={{ fontSize: '0.85rem' }}>{c.user}</strong>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{c.date}</span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{c.text}</p>
                                  <button 
                                    onClick={() => deleteComment(mediaId, i)}
                                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem' }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tags Mod */}
                          <div>
                            <h5 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> Tags Activity</h5>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {(data.tags || []).map((tag: string) => (
                                <span key={tag} className="tag-pill">
                                  #{tag} 
                                  <Trash2 size={10} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} onClick={() => removeSocialTag(mediaId, tag)} />
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* --- TAB: MEDIA --- */}
            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <SectionHeader title="Media Monitor" subtitle="Vezi rapid starea fișierelor încărcate în server." />
                <div className="feature-card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }}>
                  <Video size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                  <h3>Scanare Automată Activă</h3>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                    Site-ul scanează automat folderele de pe disc. Orice video sau poză adăugată în <code>/public/Storage</code> va apărea instantaneu pe paginile corespunzătoare.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <div className="badge" style={{ padding: '1rem 2rem' }}>Galerie: OK</div>
                    <div className="badge" style={{ padding: '1rem 2rem' }}>Cursuri: OK</div>
                    <div className="badge" style={{ padding: '1rem 2rem' }}>Instructori: OK</div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <header style={{ marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{subtitle}</p>
    </header>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <code>{value}</code>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width: '35px', height: '35px', border: 'none', borderRadius: '50%', cursor: 'pointer' }} />
      </div>
    </div>
  );
}

function RangeInput({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{value}px</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
    </div>
  );
}

export default Dashboard;
