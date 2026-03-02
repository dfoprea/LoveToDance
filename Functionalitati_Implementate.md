# Funcționalități Implementate - Love2Dance (LTD)

Acest document conține istoricul funcționalităților implementate în platforma web Love2Dance, alături de motivul și utilitatea fiecărei alegeri arhitecturale sau de business.

## 1. Arhitectură și Design
* **Implementare:** Design hibrid cu **Dark Mode ca temă implicită** și opțiune clară de comutare către **Light Mode**, pentru a acoperi preferințele tuturor utilizatorilor. Estetica este inspirată puternic din platforme de top (ex. Melómano), folosind un "Video-First Hero Section" (o secțiune principală animată cu material video din școală), integrată organic cu elementele de branding din bannerul oficial LTD (roșu purpuriu pasional, accente metalice).
* **Motiv/Utilitate:** Un fundal întunecat (dark mode) recreează senzația de "social party" și scoate în evidență elementele media (foto/video), dar existența unei teme luminoase asigură accesibilitate maximă pe timpul zilei. Video-ul de fundal captează atenția instant și comunică "energia" dansului mai bine decât orice text.

## 2. Sistemul de Administrare (Dashboard) și Personalizare Live (Theme Builder)
* **Implementare:** Arhitectură tehnică bazată pe **Variabile CSS dinamice** (ex. `--primary`, `--bg-dark`, `--radius-btn`). Am implementat un modul "Theme Builder" în panoul de Admin (Dashboard). 
* **Motiv/Utilitate:** Proprietarul (Corina) primește un panou de control vizual de unde poate schimba culorile (accent, fundal, carduri) și razele de curbură (colțuri rotunjite) folosind selectoare vizuale (color pickers și slidere). Modificările se aplică *în timp real* pe un sample vizual din dashboard și afectează instant întreg site-ul, eliminând nevoia intervenției unui dezvoltator pentru ajustări de branding.

## 3. Sistem Universal de Tag-uri
* **Implementare:** Toate entitățile de pe site (videouri, poze, texte, componente) sunt indexate folosind un sistem de Tag-uri (etichete). Tag-urile speciale de tip "admin" sau "privat" controlează vizibilitatea.
* **Motiv/Utilitate:** Facilitează o administrare modulară și extrem de flexibilă a conținutului. Ordonarea, căutarea și filtrarea se fac instant. Proprietarul poate ascunde/afișa secțiuni întregi pe baza tag-urilor.

## 4. Biblioteca Video (Pagina "Combinații / Combo-uri") și Format Vertical
* **Implementare:** O secțiune dedicată (arhivă video) pentru postarea coregrafiilor. Formatul player-ului și al materialelor video va fi orientat cu prioritate către **formatul vertical (tip TikTok/Reels, 9:16)**.
* **Motiv/Utilitate:** Rezolvă problema pierderii materialelor video pe grupurile de WhatsApp. Crește masiv retenția elevilor. Alegerea formatului vertical este dictată de comportamentul utilizatorilor: majoritatea covârșitoare a cursanților accesează platforma de pe telefonul mobil, iar formatul TikTok maximizează spațiul pe ecran și oferă o experiență de vizionare fluidă, naturală pentru 2026.

## 5. Integrare Harta Google (Google Maps)
* **Implementare:** Harta interactivă cu pinpoint pe adresa studioului (Splaiul Unirii 162).
* **Motiv/Utilitate:** Înlătură orice barieră de navigare pentru clienții noi (începătorii) care vin la prima ședință gratuită. Oferă credibilitate locală și ajută la SEO pe zona București.

## 6. Social Wall (Integrare Instagram & TikTok)
* **Implementare:** Grilă vizuală care preia / mimează estetica platformelor sociale unde școala este activă, integrând link-urile oficiale de Instagram și TikTok ale școlii.
* **Motiv/Utilitate:** Dansul social vinde prin "vibe" și emoție. Afișarea energiei din comunitatea "LTD Family" direct pe site scade reticența celor care cred că au "două picioare stângi" și arată latura umană, de socializare, a școlii.

## 7. Sistem de Auto-Discovery pentru Galerie
* **Implementare:** Folosirea tehnologiei Vite Glob Import pentru a scana automat folderul `/public/Storage/Galerie`.
* **Motiv/Utilitate:** Automatizează complet mentenanța galeriei. Corina nu mai trebuie să modifice codul site-ului; este suficient să încarce fișiere în folderele corespunzătoare (Salsa, Bachata etc.), iar site-ul le va afișa instantaneu.

## 8. Controlul Ordinii prin Convenție de Nume (Smart Sorting)
* **Implementare:** Sistem de sortare bazat pe prefixul `[AAAA-LL-ZZ]` în numele fișierului.
* **Motiv/Utilitate:** Oferă administratorului control total asupra ordinii de afișare fără a avea nevoie de o bază de date. Permite "forțarea" unor materiale vechi în față sau organizarea cronologică precisă a evenimentelor prin simpla redenumire a fișierelor.

## 9. Interacțiune Avansată în Vizualizatorul Media
* **Implementare:** Împărțirea zonei video în regiuni active (Centru pentru Play/Pause, Margini pentru Navigare) și implementarea gesturilor de tip **Swipe** (glisare).
* **Motiv/Utilitate:** Oferă o experiență de utilizare "app-like", similară cu TikTok sau Instagram. Utilizatorii pot naviga rapid prin colecția video folosind gesturi naturale pe mobil sau click-uri intuitive pe desktop.

## 10. Bara de Miniaturi (Thumbnails) Interactivă
* **Implementare:** Drag-to-scroll (apucă și trage), Horizontal Wheel Scroll (derulare cu rotița mouse-ului) și generare automată de snapshot-uri din prima secundă a videoclipurilor.
* **Motiv/Utilitate:** Face navigarea prin zeci de videoclipuri rapidă și vizuală. Snapshots-urile elimină necesitatea de a încărca tot videoclipul pentru a vedea ce conține, economisind date mobile și timp de încărcare.

## 11. Internaționalizare (i18n) Extinsă
* **Implementare:** Maparea completă a paginilor de Instructori, Cursuri și Program în sistemul de traduceri (RO, EN, DE, FR).
* **Motiv/Utilitate:** Permite școlii să atragă și expați sau turiști aflați în București, oferind o imagine profesională și incluzivă.

## 12. Optimizare Header și Layout (Mobile-Ready)
* **Implementare:** Header compact (80px), z-index maxim (9999), Redimensionare Logo și eliminarea elementelor redundante.
* **Motiv/Utilitate:** Rezolvă problemele de accesibilitate unde butoanele nu puteau fi apăsate din cauza suprapunerilor. Garantează că meniul rămâne funcțional și vizibil pe orice dimensiune de ecran.

## 13. LTD Social Hub (Comentarii și Tag-uri)
* **Implementare:** Integrarea unui panou lateral de interacțiune în stil Facebook/Instagram, folosind `localStorage` pentru persistența datelor la nivel de browser. Fiecare fișier media are un ID unic generat din numele său, de care sunt legate comentariile și etichetele.
* **Motiv/Utilitate:** Transformă site-ul dintr-o galerie statică într-o platformă socială vie. Permite cursanților să interacționeze, să își lase feedback-ul și să organizeze conținutul prin tag-uri (ex: #tehnica, #petrecere). Este un instrument puternic de "Social Proof" - vizitatorii noi văd activitatea și entuziasmul comunității direct lângă materialele video.

## 14. Secțiune Final CTA cu Efect Parallax
* **Implementare:** Integrarea bannerului oficial LTD ca fundal fix (parallax) în secțiunea de Program și pe prima pagină, cu un overlay de gradient adaptiv.
* **Motiv/Utilitate:** Bannerul LTD ancorează brandingul în subconștientul vizitatorului. Efectul de parallax adaugă o notă premium, de site modern de top.

## 15. Sistem de Autentificare și Roluri (Auth System)
* **Implementare:** Arhitectură bazată pe `AuthContext` cu persistență în `localStorage`. Sistem de roluri: **Admin** (acces total la Dashboard prin utilizatorul `admin/admin`) și **Student**.
* **Motiv/Utilitate:** Permite o gestionare securizată a site-ului. Butonul de Login este dinamic, transformându-se în "⚙️ Admin" sau "👤 Profil" după autentificare, protejând zonele administrative.

## 16. Modul de Checkout Avansat
* **Implementare:** Flux de înscriere complet cu selecția metodelor de plată (Card, PayPal, Cash la sală), recapitulativ de comandă și mesaje de securitate ("Conexiune SSL securizată").
* **Motiv/Utilitate:** Crește rata de conversie prin oferirea unui proces de plată transparent și profesionist. Opțiunea "Cash la sală" încurajă înscrierea rapidă a celor reticenți la plățile online.

## 17. Sistem Global de Notificări (Toasts)
* **Implementare:** Înlocuirea ferestrelor de `alert()` cu notificări animate de tip Toast în colțul dreapta-jos al ecranului (Succes, Eroare, Info).
* **Motiv/Utilitate:** Îmbunătățește experiența utilizatorului prin feedback non-invaziv, oferind site-ului o senzație de aplicație modernă.

## 18. SEO Tehnic Avansat și Local Business Schema
* **Implementare:** 
    * **JSON-LD:** Schema "DanceSchool" pentru recunoașterea automată a adresei, orarului și telefonului de către Google.
    * **SEOUpdater:** Script dinamic care actualizează Meta Tag-urile la fiecare schimbare de pagină.
    * **Robots & Sitemap:** Generarea automată a fișierelor de indexare.
* **Motiv/Utilitate:** Corectează deficiențele de marketing organic. LTD este acum optimizat pentru a apărea în căutările locale și pe Google Maps.

## 19. Optimizare Mobilă și UX Tactil
* **Implementare:** Navigație de tip "Slider" pe mobil, hitbox-uri de 44px, adaptarea grilelor și optimizarea video-ului vertical.
* **Motiv/Utilitate:** Site-ul este acum 100% "Mobile-First", fiind ușor de folosit cu o singură mână pe orice smartphone.

## 20. Arhitectură pentru Producție (Deploy Ready)
* **Implementare:** Fixare căi media relative, logică de extragere URL-uri din module Vite și fișier `_redirects` pentru SPA.
* **Motiv/Utilitate:** Asigură funcționarea perfectă pe Netlify fără ecrane albe sau crash-uri JavaScript.

## 21. Fluiditatea vizuală cu ajutorul bibliotecilor proaspăt instalate (framer-motion și lucide-react)
* **Implementare:** 
    * **Animații de Intrare:** Integrarea `framer-motion` pentru a anima apariția elementelor pe pagină (fade-in, slide-up). Paginile care anterior erau statice au acum o tranziție lină la încărcare.
    * **Sistem de Iconițe Modern:** Utilizarea `lucide-react` pentru o bibliotecă de iconițe vectorială, consistentă și performantă, înlocuind elementele grafice vechi.
    * **Feedback Tactil (Hover):** Implementarea unor efecte de hover rafinate (glow subtil și schimbarea culorii bordurii) care oferă utilizatorului confirmarea vizuală a interacțiunii fără a altera structura sau poziția elementelor.
* **Motiv/Utilitate:** Crește calitatea percepută a platformei. Mișcările fluide fac site-ul să se simtă "viu" și premium, reducând rata de respingere (bounce rate) și oferind o experiență utilizator demnă de o școală de dans modernă.

## 22. Optimizare Responsivă Galerie (Mobile-First Layout)
* **Implementare:** Corecție de layout folosind Media Queries pentru a trece de la structura de tip "Side-by-Side" (Desktop) la "Stacked" (Mobile). Am setat un `aspect-ratio: 9/16` specific pentru mobil pentru a acomoda videourile verticale (format TikTok).
* **Motiv/Utilitate:** Asigură vizibilitatea corectă a zonei video pe telefoane. Anterior, panoul social (tag-uri/comentarii) împingea conținutul media în afara ecranului. Acum experiența este fluidă și adaptată consumului de conținut video pe verticală.

## 22. Strategie SEO State-of-the-Art (Cei 5 Piloni)
* **Implementare & Context:** Am definitionat și început implementarea unei strategii SEO moderne (nivel 2026) bazată pe 5 piloni fundamentali:
  1. **Generative Engine Optimization (GEO):** Optimizarea pentru AI (ChatGPT, Perplexity etc.) prin oferirea de răspunsuri clare, tip definiție, la întrebări specifice.
  2. **Programmatic SEO (PSEO):** Generarea la scară a paginilor pentru căutări "long-tail".
  3. **Semantic SEO & Advanced Schema (JSON-LD):** Structurarea datelor (Entități) pentru ca mașinile să le citească instantaneu fără a parsa text vizual.
  4. **Performanță & INP (Interaction to Next Paint):** Viteza extremă de reacție a site-ului.
  5. **E-E-A-T (Experiență, Expertiză, Autoritate, Trust):** Demonstrarea calității prin testimoniale, profiluri reale de experți și interacțiuni ce rețin utilizatorul (Dwell Time).
* **Decizie Arhitecturală (De ce NU Programmatic SEO):** Pentru LTD (o afacere locală), PSEO a fost exclus momentan. Generarea a sute de pagini pentru fiecare sector (ex. "salsa sector 1") este tehnic costisitoare pentru o aplicație React SPA (necesită trecerea la SSG complex) și aduce un ROI mic comparativ cu optimizarea Google Maps (Local Pack) și traficul vizual din Social Media. Am ales să ne concentrăm pe "Quick Wins" de impact masiv.
* **Ce am implementat efectiv (Faza 1 - Pilonii 3 și 5):** 
  Am rescris masiv datele structurate (JSON-LD) invizibile din `index.html` pentru a "traduce" Google-ului sufletul școlii:
  * **Autoritate & E-E-A-T:** Am adăugat experiența de 20 de ani a școlii în descrierea generală și o listă de tip `Person` cu cei 6 profesori principali pentru a asocia expertiza umană cu brandul.
  * **Schema `Course`:** Am detaliat structura cursurilor (Salsa & Bachata, Kizomba), menționând explicit că ne adresăm atât începătorilor absoluți, cât și intermediarilor.
  * **Schema `Event`:** Am semnalizat sesiunile gratuite de weekend ("Timp pentru dans") ca evenimente structurate.
  * **Schema `FAQPage`:** Am integrat întrebări și răspunsuri cheie care demontează obiecțiile (nu e nevoie de partener, ce încălțăminte trebuie) și promovează "comunitatea" (ieșiri la Rio/Preoteasa, petreceri, festivaluri în țară). De asemenea, am clarificat că, deși locația fizică este la Timpuri Noi, avem un reach extins, cu cursanți din tot Bucureștiul.
* **Motiv/Utilitate:** Aceste date bogate permit afișarea site-ului în căutări prin "Rich Snippets" (elemente vizuale direct în Google), comunică autoritatea școlii și pregătesc terenul pentru motoarele de răspuns AI, asigurând tracțiune maximă fără a compromite designul elegant (care rămâne curat pentru utilizatorul uman).
* **"Inima" Afacerii ca Motor SEO și de Conversie:** Am realizat că diferențiatorul major față de site-urile generice este tocmai cultura și logistica școlii. Aceste detalii, implementate în structura SEO, reprezintă "aur curat" pentru conversie, deoarece răspund direct la obiecțiile și dorințele reale ale cursanților:
  * **Niveluri multiple:** Avem cursuri atât pentru începători, cât și grupe de intermediari.
  * **Reach extins:** Deși locația este la Timpuri Noi, elevii vin din toate sectoarele Bucureștiului (inclusiv Sectorul 1).
  * **Expertiză masivă:** Instructorii (precum Corina, cu 20 de ani experiență) sunt dansatori la nivel competițional, prezenți la festivaluri, extrem de dedicați.
  * **Comunitate vibrantă:** Organizăm sesiuni gratuite "Timp pentru dans" în weekend, ieșiri lunare în cluburi de social dancing (Rio, Preoteasa), petreceri cu cursanții, tabere la munte/mare și participări la festivaluri naționale (Brașov, Vama Veche, Cluj). Există chiar și trupa de performanță "LoveToDance".
  * **Logistică clară:** Deoarece majoritatea lucrează, cursurile se țin seara, de 2 ori pe săptămână. Nu este necesar partener (perechile se schimbă la fiecare exercițiu pentru a câștiga experiență) și este necesară doar încălțăminte de schimb. Această transparență construiește imediat încredere (Pilonul E-E-A-T).
  * **Concluzie SEO:** Prin expunerea acestor date structurate, Google va începe să asocieze LTD cu aceste concepte (comunitate, experiență, socializare), nu doar cu o simplă "adresă pe hartă".

## 23. Pagina FAQ & Ghid pentru AI (GEO Optimization)
* **Implementare:** Crearea unei pagini dedicate (`FAQ.tsx`) structurată sub formă de întrebări și răspunsuri clare. Aceasta acoperă atât logistica (partener, încălțăminte), cât și un lexicon de dans (Salsa LA, Bachata Sensual, Kizomba).
* **Motiv/Utilitate:** Vizează **Pilonul 1 (GEO)**. Structura de tip "Definiție" la începutul fiecărui răspuns este optimizată special pentru a fi extrasă de motoarele de răspuns bazate pe AI (ChatGPT, Google SGE). Oferă în același timp un ghid rapid și util pentru noii cursanți, scăzând bariera de intrare în școală.

## 24. Optimizare Performanță Media (Lazy Loading & Smart Playback)
* **Implementare:** 
    * **Lazy Loading:** Aplicarea atributului `loading="lazy"` pe toate imaginile din Galerie și Cursuri.
    * **Preload Management:** Setarea `preload="metadata"` pentru miniaturile video pentru a economisi lățime de bandă.
    * **Smart Playback:** Integrarea `IntersectionObserver` în `GalleryHub.tsx` pentru redarea automată a videoclipurilor doar când sunt vizibile pe ecran și pauză automată la scroll.
* **Motiv/Utilitate:** Vizează **Pilonul 4 (INP & Performanță)**. Asigură o viteză de încărcare superioară și un timp de interacțiune scăzut, factori esențiali pentru ranking-ul Google. Logica de playback reține atenția utilizatorului (Dwell Time) fără a suprasolicita dispozitivele mobile.

## 25. Navigare Fluidă în Galerie și Instructori (Hover-to-Scroll)
* **Implementare:** 
    * **Hover-to-Scroll:** Mecanism de scroll automat pentru bara de miniaturi bazat pe poziția mouse-ului față de centrul containerului (viteză variabilă). Implementat atât în `GalleryHub.tsx` cât și în `Instructors.tsx`.
    * **Uniformizare Media:** Eliminarea etichetelor statice (ex. "VIDEO") din pagina de Instructori și înlocuirea lor cu miniaturi video reale (frame-ul de la secunda 0.5) pentru o experiență vizuală consistentă în tot site-ul.
* **Motiv/Utilitate:** Îmbunătățește experiența de navigare prin colecții mari de fișiere media. Utilizatorul poate explora galeria și media instructorilor fără click-uri repetate, oferind o senzație de fluiditate modernă ("premium feel"). Uniformizarea asigură că utilizatorul recunoaște imediat modul de interacțiune pe orice pagină.

## 26. Rafinare UX & Checkout Dinamic
* **Implementare:** 
    * **Checkout:** Setează prețurile reale (220/250 RON) și preia automat pachetul ales prin parametri URL.
    * **Header Responsiv:** Implementarea unui scroll orizontal discret pentru link-urile de navigare și ascunderea inteligentă a textului branding-ului pe ecrane medii.
    * **Integritate Date:** Generarea de ID-uri unice per fișier (categorie + nume) pentru a elimina conflictele de chei în React.
* **Motiv/Utilitate:** Elimină fricțiunea în procesul de înscriere și asigură o interfață impecabilă pe orice dispozitiv, de la telefoane mici la monitoare ultra-wide.

## 27. Internaționalizare Completă (RO, EN, DE, FR)
* **Implementare:** Extinderea sistemului `i18n` pentru a acoperi toate paginile noi (FAQ, Tarife, Instructori) în patru limbi. Am implementat persistența selecției în `localStorage`, asigurând că site-ul își amintește limba preferată a utilizatorului.
* **Motiv/Utilitate:** Vizează un public divers și internațional în București. Oferă o experiență de utilizare fără cusur, eliminând barierele lingvistice pentru expați și turiști.

## 28. Găzduire Permanentă și Optimizare Deployment (Surge.sh)
* **Implementare:** 
    * **Hosting:** Publicarea permanentă la adresa `https://love-to-dance-ro.surge.sh/`.
    * **Optimizare SPA:** Implementarea fișierului `200.html` în folderul de build pentru a permite navigarea directă pe rute (Deep Linking) și refresh-ul paginilor fără erori 404.
    * **Gestiune Resurse:** Reducerea dimensiunii proiectului prin eliminarea selectivă a fișierelor video de peste 10MB, asigurând un timp de upload și încărcare optim.
* **Motiv/Utilitate:** Asigură prezența online continuă a școlii și o navigare tehnică corectă pe orice pagină (Galerie, FAQ etc.), indiferent de punctul de intrare al utilizatorului.

## 29. Rafinamente UI/UX, Reparații de Navigație și Animații Fluide
* **Implementare:** 
    * **Navigație Orizontală Centralizată:** Refacerea meniului principal de pe desktop (Header) prin eliminarea completă a scroll-ului orizontal inestetic, ajustarea flexbox-ului, a fonturilor și a padding-urilor pentru a asigura vizibilitatea integrală a tuturor link-urilor (inclusiv "Combinații" și "Galerie") pe un singur rând, indiferent de rezoluție.
    * **Reparații Video Playback:** Fixarea conflictului de evenimente (dublu-click de play/pause) pe materialele video din paginile **Galerie** și **Instructori**. Acum, click-ul pe zona video nu mai interferează cu controalele native ale browserului, asigurând o redare corectă și fără întreruperi.
    * **Animații de Interfață (Framer Motion):** Integrarea unor animații subtile, profesionale, pe paginile statice (**Cursuri**, **Combinații**, **FAQ** și **Program**). Cardurile au acum efecte soft de tip "Hover" (ridicare ușoară și accentuare a umbrei), iar la încărcarea paginii elementele apar lin prin efecte de `fadeInUp`. S-a renunțat la animațiile lente sau intruzive (ex. "stagger") la cererea expresă, pentru a menține aplicația "snappy" și rapidă.
* **Motiv/Utilitate:** Un UI "pixel-perfect" și un UX intuitiv sporesc substanțial încrederea utilizatorilor. Meniul perfect vizibil previne frustrarea, redarea video corectă asigură consumul de conținut fără erori, iar animațiile din `framer-motion` transformă paginile altfel statice într-o experiență premium, modernă, demnă de o școală de dans de top.

## Capitolul 11: Ecosistemul Social Love2Dance (LTD Social) - [2026-03-02]

Acest capitol documentează transformarea site-ului dintr-o prezentare statică într-o platformă socială interactivă. Am implementat un sistem complet de interacțiune (Like, Comment, Share, Tags) bazat pe următoarele principii tehnice și de design:

### 1. Arhitectura de Date (Social State Manager)
*   **Persistență Local-First:** Toate interacțiunile utilizatorului sunt salvate în `localStorage` sub cheia `ltd_social_data`. Această alegere oferă o viteză instantanee de reacție și suveranitate asupra datelor.
*   **Unique ID Mapping:** Fiecare fișier media are un ID unic generat din calea sa (ex: `salsa-video1.mp4`). Acest ID servește drept cheie pentru a lega Like-urile și Comentariile de conținutul respectiv.
*   **Safe Data Extraction:** Logica de randare folosește un sistem de "fallback" (ex: `item.comments || []`), prevenind erorile de tip `undefined` dacă un videoclip are Like-uri dar nu are încă comentarii.

### 2. Soluții pentru Stabilitatea Interfeței (UX Stability)
Una dintre cele mai mari provocări a fost prevenirea "săriturii" (jumping) videoclipului la deschiderea comentariilor. Am rezolvat acest lucru prin:
*   **Layer Isolation (Tehnică Critică):** În pagina de **Combinatii**, am izolat videoclipul într-un container cu `position: absolute; inset: 0`. Astfel, spațiul său este rezervat permanent, iar apariția elementelor deasupra (comentariile) nu mai forțează browserul să recalculeze dimensiunile video-ului.
*   **DOM Preservation:** Bara de interacțiune (`Like`/`Share`) nu mai este ștearsă din cod când se deschid comentariile, ci devine doar transparentă (`opacity: 0`). Acest lucru menține structura DOM-ului intactă, eliminând orice motiv pentru layout shift.
*   **Internal Smooth Scroll:** Am înlocuit `scrollIntoView` (care mișca toată pagina) cu `.scrollTo({ top: scrollHeight })` aplicat strict pe lista internă de comentarii.

### 3. Modele Sociale Adaptate (Facebook vs TikTok)
Am implementat două experiențe de vizualizare diferite, în funcție de context:
*   **Modelul Vertical (Galerie):** Inspirat de Facebook, unde media ocupă toată lățimea, iar discuțiile curg generos dedesubt (Split 70% Comentarii / 30% Tags).
*   **Modelul Overlay Drawer (Combinatii):** Inspirat de TikTok/Reels, unde un sertar transparent (negru 60%, fără blur pentru claritate maximă) glisează peste treimea inferioară a videoclipului, permițând discuția fără a pierde acțiunea de fundal.

### 4. Sistemul Dinamic de Tags (Metadate Active)
*   **Filtrare Universală:** Un click pe un tag (pastilă mică gri/roz) activează un filtru care reduce galeria doar la momentele respective.
*   **Afișare "On-Demand":** Secțiunea de Tags este invizibilă pentru vizitatori dacă nu există etichete, păstrând interfața curată.
*   **Ierarhie de Permisiuni:** 
    *   *Vizitator:* Postează comentarii, dă Like, Partajează și Filtrează.
    *   *Admin:* Singurul care poate adăuga `#tag-uri` noi sau șterge etichete, controlând astfel organizarea întregului site.

### 5. Detalii Premium (Final Polish)
*   **Format Dată Internațional:** Am adoptat standardul `2 Mar 2026 14:30`, mult mai elegant și mai clar decât formatul local cu puncte.
*   **Incentive Input:** Câmpul de scriere are avatar neutru, glow roșu la selecție și animație de rotire a butonului de trimitere, invitând activ la conversație.

---
*Document actualizat pe 2 Martie 2026.*
