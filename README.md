# 💃 Love to Dance (LTD) - Bucharest

Platforma web oficială a școlii de dans **Love to Dance** din București. O experiență modernă, fluidă și captivantă pentru pasionații de Salsa, Bachata și Kizomba.

## 🚀 Live Demo
Vizualizează aplicația live aici: **[https://love-to-dance-family.surge.sh/](https://love-to-dance-family.surge.sh/)**

---

## 🆕 Recent Update: SEO Prerendering — Site Vizibil pe Google (SSG) [2026-03-03]
Site-ul era construit ca React SPA, ceea ce înseamnă că Googlebot vedea doar `<div id="root"></div>` gol — fără conținut indexabil. Această actualizare rezolvă complet problema prin **Static Site Generation (SSG) post-build**:

1. **Script `prerender.mjs`:** Un script Node.js cu Puppeteer (browser headless) care rulează automat după `vite build`. Vizitează fiecare rută publică, așteaptă ca React să randeze complet (inclusiv animații și contexte), și salvează HTML-ul în `dist/{ruta}/index.html`.
2. **10 rute pre-randate:** `/`, `/instructors`, `/features`, `/pricing`, `/faq`, `/schedule`, `/gallery`, `/combinations`, `/contact`, `/privacy`.
3. **Animații intacte:** Prerendering-ul nu afectează Framer Motion sau interactivitatea — React preia controlul (hydration) imediat după încărcarea JavaScript-ului. Utilizatorul nu simte nicio diferență.
4. **Integrat în build:** Comanda `npm run build` include automat pasul de prerendering. Nu necesită pași suplimentari la deploy.

**Impact:** Googlebot indexează acum conținut real (titluri, texte, JSON-LD, meta tags) în loc de pagină goală. Estimat +50-100% trafic organic în 3 luni față de varianta SPA pură.

---

## 🆕 Recent Update: Actualizare Dashboard de Admin (v3.0)
Această versiune transformă Dashboard-ul într-un centru veritabil de **Business Intelligence (BI)** și **Community Management (CRM)**:

1. **Analytics BI (Power BI Style):** Un generator de rapoarte interactiv cu funcționalitate **Drag & Drop**. Corina poate tăia datele (Likes, Comments, Engagement) pe orice axă dorită (Timeline, Stiluri de Dans, Tag-uri) folosind un motor de tip Pivot Table integrat.
2. **Community CRM:** Tabel automat de monitorizare a utilizatorilor care extrage istoricul de interacțiuni, prima și ultima activitate, oferind posibilitatea de a bloca (Ban) utilizatori cu un singur click.
3. **Branding Studio 2.0:** Control extins asupra întregii palete de culori și a formelor (border-radius) cu **Live Preview** instantaneu.
4. **CMS Editor v2:** Organizare inteligentă a textelor pe pagini (tab-uri) și input-uri automate care detectează lungimea textului.
5. **Unified Brand Identity:** Integrare completă a brandului **LoveToDance** (corectat) și restaurarea stilului cursiv roșu original pentru impact maxim.

### 🛡️ Optimizare SEO & Performanță
Utilizarea bibliotecilor **framer-motion** și **lucide-react** nu afectează negativ SEO, ci contribuie activ la succesul platformei:
1. **Lucide-React (Iconițe):** Folosește formatul **SVG**, cod text care se încarcă instantaneu. Prin tehnologia "Tree Shaking" din Vite, sunt incluse doar iconițele utilizate, menținând site-ul extrem de ușor.
2. **Framer-Motion (Animații):** Elementele sunt animate post-încărcare, asigurând că **Googlebot** poate citi textul sursă integral din prima secundă.
3. **Performanță (Core Web Vitals):** Interfața fluidă crește **Dwell Time** (timpul petrecut de utilizatori pe site), un semnal pozitiv major pentru algoritmii de ranking Google.

---

## ✨ Caracteristici Principale

- **Design Modern:** Interfață orientată spre conținut vizual, cu Dark Mode implicit.
- **Galerie Socială:** Sistem avansat de vizualizare media (Foto/Video) cu funcționalități de tip TikTok/Instagram.
- **Auto-Discovery:** Administrare inteligentă a conținutului prin scanarea automată a directoarelor de stocare.
- **Internationalizare:** Suport complet pentru 4 limbi (RO, EN, DE, FR).
- **Theme Builder:** Panou de control pentru personalizarea live a culorilor direct din Dashboard.

## 🛠️ Tehnologii Utilizate

- **Frontend:** React + TypeScript + Vite
- **Animații:** Framer Motion
- **Iconițe:** Lucide React
- **Styling:** CSS Modern (Custom Variables)
- **Deployment:** Surge.sh

---

## 📖 Documentație
Pentru detalii tehnice complete și istoricul implementărilor, consultă:
- [Funcționalități Implementate (Markdown)](./Functionalitati_Implementate.md)
- [Funcționalități Implementate (PDF)](./Functionalitati_Implementate.pdf)

---
*Creat cu pasiune pentru comunitatea LTD Family.*
