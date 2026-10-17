// ==========================================================================
// RUSH CLUB SHOWCASE INTERACTION SCRIPT
// Language switching, 3D Emblem Drag/Tilt, Counter Animations,
// Marquee Loop, Scroll-Reveal & Lightbox
// ==========================================================================

let currentLang = 'en';

// Helper to set text safely
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

// Format numbers for Arabic locale if needed
function formatNumber(num, lang) {
  if (num === null || num === undefined) return '';
  return lang === 'ar' ? new Intl.NumberFormat('ar-SA').format(num) : num.toString();
}

// Render dynamic content based on selected language
function renderContent(lang) {
  const data = rushContent[lang];
  if (!data) return;

  // Set HTML root dir and lang
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Toggle button text
  const langBtnText = document.getElementById('lang-btn-text');
  if (langBtnText) {
    langBtnText.textContent = lang === 'en' ? 'العربية' : 'English';
  }

  // Navigation Links
  setText('nav-link-about', data.nav.about);
  setText('nav-link-what-we-do', data.nav.whatWeDo);
  setText('nav-link-achievements', data.nav.achievements);
  setText('nav-link-events', data.nav.events);
  setText('nav-link-collabs', data.nav.collabs);
  setText('nav-link-leadership', data.nav.leadership);
  setText('nav-cta-follow', data.hero.ctaFollow);

  // Mobile Drawer Links
  setText('m-nav-about', data.nav.about);
  setText('m-nav-what-we-do', data.nav.whatWeDo);
  setText('m-nav-achievements', data.nav.achievements);
  setText('m-nav-events', data.nav.events);
  setText('m-nav-collabs', data.nav.collabs);
  setText('m-nav-leadership', data.nav.leadership);
  setText('m-cta-follow', data.hero.ctaFollow);

  // Hero Section
  setText('hero-club-tag', data.hero.clubTag);
  setText('hero-badge', data.hero.badge);
  setText('hero-tagline-1', data.hero.taglinePart1);
  setText('hero-tagline-2', data.hero.taglinePart2);
  setText('hero-subtagline', data.hero.subTagline);
  setText('hero-intro', data.hero.intro);
  setText('hero-cta-follow', data.hero.ctaFollow);
  setText('hero-cta-story', data.hero.ctaStory);
  setText('emblem-hint', data.hero.emblemHint);
  setText('emblem-back-text', data.hero.emblemBackLabel);

  // Hero Stats Ticker
  const heroMarqueeTrack = document.getElementById('hero-marquee-track');
  if (heroMarqueeTrack) {
    const tickerItemsHtml = data.hero.statsTicker.map(item => `
      <div class="ticker-stat-item">
        <strong>${item.strong}</strong>
        <span>${item.label}</span>
      </div>
    `).join('');
    // Duplicate for seamless infinite loop
    heroMarqueeTrack.innerHTML = tickerItemsHtml + tickerItemsHtml;
  }

  // About Section
  setText('about-eyebrow', data.about.eyebrow);
  setText('about-title', data.about.title);
  setText('about-lead', data.about.lead);
  setText('about-desc', data.about.desc);
  setText('timeline-heading', data.about.timelineTitle);

  const timelineContainer = document.getElementById('timeline-container');
  if (timelineContainer) {
    timelineContainer.innerHTML = data.about.timeline.map(item => `
      <div class="timeline-item reveal">
        <div class="timeline-dot" aria-hidden="true"></div>
        <span class="timeline-idx">${item.num} // ${item.date}</span>
        <h4 class="timeline-title">${item.title}</h4>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `).join('');
  }

  // What We Do Section
  setText('what-we-do-eyebrow', data.whatWeDo.eyebrow);
  setText('what-we-do-title', data.whatWeDo.title);
  setText('what-we-do-desc', data.whatWeDo.desc);

  setText('sports-tag', data.whatWeDo.sports.tag);
  setText('sports-title', data.whatWeDo.sports.title);
  setText('sports-desc', data.whatWeDo.sports.desc);
  const sportsTagsContainer = document.getElementById('sports-tags');
  if (sportsTagsContainer) {
    sportsTagsContainer.innerHTML = data.whatWeDo.sports.badges
      .map(b => `<span class="tag-pill">${b}</span>`).join('');
  }

  setText('esports-tag', data.whatWeDo.esports.tag);
  setText('esports-title', data.whatWeDo.esports.title);
  setText('esports-desc', data.whatWeDo.esports.desc);
  const esportsTagsContainer = document.getElementById('esports-tags');
  if (esportsTagsContainer) {
    esportsTagsContainer.innerHTML = data.whatWeDo.esports.badges
      .map(b => `<span class="tag-pill">${b}</span>`).join('');
  }

  // Achievements Section
  setText('achieve-eyebrow', data.achievements.eyebrow);
  setText('achieve-title', data.achievements.title);
  setText('achieve-subtitle', data.achievements.subtitle);

  const statsGrid = document.getElementById('stats-grid');
  if (statsGrid) {
    statsGrid.innerHTML = data.achievements.stats.map(stat => {
      const isPlaceholder = stat.num === null;
      return `
        <div class="stat-card reveal">
          <div class="stat-num-wrap ${isPlaceholder ? 'placeholder-stat' : ''}">
            ${isPlaceholder 
              ? `<span>${stat.placeholder}</span>` 
              : `<span class="counter-num" data-target="${stat.num}">0</span>${stat.suffix || ''}`}
          </div>
          <div class="stat-label">${stat.label}</div>
          <div class="stat-sub">${stat.sub}</div>
        </div>
      `;
    }).join('');
  }

  const recordsGrid = document.getElementById('records-grid');
  if (recordsGrid) {
    recordsGrid.innerHTML = data.achievements.records.map(rec => `
      <div class="record-card reveal">
        <span class="record-card-badge">${rec.badge}</span>
        <h4 class="record-title">${rec.title}</h4>
        <div class="record-scope">${rec.scope}</div>
        <p class="record-desc">${rec.desc}</p>
      </div>
    `).join('');
  }

  // Events & Highlights Section
  setText('events-eyebrow', data.events.eyebrow);
  setText('events-title', data.events.title);
  setText('events-subtitle', data.events.subtitle);

  const eventsGrid = document.getElementById('events-grid');
  if (eventsGrid) {
    eventsGrid.innerHTML = data.events.items.map(item => `
      <article class="event-card reveal" tabindex="0" role="button" aria-label="${item.title}" onclick="openLightbox('${item.id}')" onkeydown="if(event.key === 'Enter') openLightbox('${item.id}')">
        <div class="event-img-wrap">
          <span class="event-idx-tag">${item.idx}</span>
          <img src="${item.imgPlaceholder}" alt="${item.title}" loading="lazy" />
          <div class="event-zoom-indicator">🔍 ${lang === 'ar' ? 'عرض' : 'Inspect'}</div>
        </div>
        <div class="event-card-body">
          <span class="event-date">${item.date}</span>
          <h4 class="event-title">${item.title}</h4>
          <span class="event-collab">${item.collab}</span>
          <p class="event-summary">${item.summary}</p>
        </div>
      </article>
    `).join('');
  }

  // Collaborations Section
  setText('collabs-eyebrow', data.collabs.eyebrow);
  setText('collabs-title', data.collabs.title);
  setText('collabs-subtitle', data.collabs.subtitle);
  setText('collab-cta-prompt', data.collabs.ctaPrompt);
  setText('collabs-cta-btn', data.collabs.ctaButton);

  const collabsMarqueeTrack = document.getElementById('collabs-marquee-track');
  if (collabsMarqueeTrack) {
    const partnerTiles = data.collabs.partners.map(p => `
      <div class="neutral-partner-tile">
        <span aria-hidden="true">${getPartnerIcon(p.iconType)}</span>
        <span>${p.name}</span>
      </div>
    `).join('');
    collabsMarqueeTrack.innerHTML = partnerTiles + partnerTiles;
  }

  const collabsGrid = document.getElementById('collabs-grid');
  if (collabsGrid) {
    collabsGrid.innerHTML = data.collabs.partners.map(p => `
      <div class="collab-card reveal">
        <div class="collab-header">
          <div class="collab-icon-box" aria-hidden="true">${getPartnerIcon(p.iconType)}</div>
          <div>
            <div class="collab-partner-badge">${p.badge}</div>
            <h4 class="collab-partner-title">${p.name}</h4>
          </div>
        </div>
        <div class="collab-event-name">${p.eventName}</div>
        <div class="collab-date">${p.date}</div>
      </div>
    `).join('');
  }

  // Leadership Section
  setText('leadership-eyebrow', data.leadership.eyebrow);
  setText('leadership-title', data.leadership.title);
  setText('leadership-desc', data.leadership.desc);
  setText('board-notice-text', data.leadership.boardNotice);

  const leadershipGrid = document.getElementById('leadership-grid');
  if (leadershipGrid) {
    leadershipGrid.innerHTML = data.leadership.leaders.map((leader, i) => `
      <div class="leader-card ${i === 1 ? 'yousef-card' : 'omar-card'} reveal">
        <div class="leader-photo-box">
          <img src="${leader.photo}" alt="${leader.name}" loading="lazy" />
        </div>
        <div class="leader-content">
          <span class="badge-tag" style="margin-bottom: 0.8rem; ${i === 1 ? 'border-color: var(--electric-teal); color: var(--electric-teal);' : 'border-color: var(--coral-red); color: var(--coral-red);'}">${leader.badge}</span>
          <h4 class="leader-name">${leader.name}</h4>
          <div class="leader-role">${leader.role}</div>
          <span class="leader-tenure">${leader.tenure}</span>
          <p class="leader-bio">${leader.bio}</p>
        </div>
      </div>
    `).join('');
  }

  // Footer
  setText('footer-tagline', data.footer.tagline);
  setText('footer-uni', data.footer.university);
  setText('footer-disclaimer', data.footer.disclaimer);
  setText('footer-copy', data.footer.copy);
  setText('footer-email', data.footer.contactEmail);

  // Footer nav links
  setText('f-nav-about', data.nav.about);
  setText('f-nav-what-we-do', data.nav.whatWeDo);
  setText('f-nav-achievements', data.nav.achievements);
  setText('f-nav-events', data.nav.events);
  setText('f-nav-collabs', data.nav.collabs);
  setText('f-nav-leadership', data.nav.leadership);

  // Re-observe reveal elements and trigger animated counters
  initScrollAnimations();
  initCounters();
}

function getPartnerIcon(type) {
  switch (type) {
    case 'mic': return '🎙️';
    case 'code': return '💻';
    case 'cpu': return '🤖';
    case 'theater': return '🎭';
    case 'palette': return '🎨';
    default: return '🤝';
  }
}

// ==========================================================================
// 3D INTERACTIVE EMBLEM (Touch / Drag / Tilt Physics)
// ==========================================================================
function init3DEmblem() {
  const wrap = document.getElementById('emblem-wrap');
  const scene = document.getElementById('emblem-scene');
  if (!wrap || !scene) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let rotX = 10;
  let rotY = -15;
  let targetRotX = 10;
  let targetRotY = -15;
  let animFrameId = null;

  function updateTransform() {
    rotX += (targetRotX - rotX) * 0.12;
    rotY += (targetRotY - rotY) * 0.12;
    scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    animFrameId = requestAnimationFrame(updateTransform);
  }
  animFrameId = requestAnimationFrame(updateTransform);

  function onPointerDown(e) {
    isDragging = true;
    wrap.classList.add('is-grabbing');
    startX = e.clientX || (e.touches && e.touches[0].clientX);
    startY = e.clientY || (e.touches && e.touches[0].clientY);
  }

  function onPointerMove(e) {
    if (!isDragging) {
      // Subtle hovering parallax
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 35;
      targetRotX = -y * 35;
      return;
    }
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    targetRotY += deltaX * 0.6;
    targetRotX -= deltaY * 0.6;

    startX = currentX;
    startY = currentY;
  }

  function onPointerUp() {
    isDragging = false;
    wrap.classList.remove('is-grabbing');
  }

  wrap.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  wrap.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Return to resting position on mouseleave
  wrap.addEventListener('mouseleave', () => {
    if (!isDragging) {
      targetRotX = 8;
      targetRotY = -12;
    }
  });
}

// ==========================================================================
// ANIMATED COUNTERS
// ==========================================================================
function initCounters() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.counter-num');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      counter.textContent = currentLang === 'ar' ? formatNumber(target, 'ar') : target;
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let current = 0;
          const duration = 1400;
          const stepTime = Math.abs(Math.floor(duration / target));
          const timer = setInterval(() => {
            current += 1;
            counter.textContent = currentLang === 'ar' ? formatNumber(current, 'ar') : current;
            if (current >= target) {
              counter.textContent = currentLang === 'ar' ? formatNumber(target, 'ar') : target;
              clearInterval(timer);
            }
          }, Math.max(stepTime, 25));
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// ==========================================================================
// SCROLL REVEAL OBSERVER
// ==========================================================================
let scrollObserver;
function initScrollAnimations() {
  if (scrollObserver) scrollObserver.disconnect();

  const elements = document.querySelectorAll('.reveal');
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => scrollObserver.observe(el));
}

// ==========================================================================
// LIGHTBOX MODAL
// ==========================================================================
function openLightbox(eventId) {
  const data = rushContent[currentLang];
  const item = data.events.items.find(e => e.id === eventId);
  if (!item) return;

  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const meta = document.getElementById('lightbox-meta');
  const desc = document.getElementById('lightbox-desc');

  if (modal && img && title && meta && desc) {
    img.src = item.imgPlaceholder;
    img.alt = item.title;
    title.textContent = item.title;
    meta.textContent = `${item.date} • ${item.collab}`;
    desc.textContent = item.summary;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('rush_lang', currentLang);
  renderContent(currentLang);
}

// Mobile drawer toggle
function toggleMobileNav() {
  const nav = document.getElementById('site-nav');
  const drawer = document.getElementById('mobile-nav');
  const burger = document.getElementById('nav-burger');
  const isOpen = drawer.classList.contains('is-open');

  if (isOpen) {
    drawer.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('is-open');
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('rush_lang');
  if (savedLang === 'ar' || savedLang === 'en') {
    currentLang = savedLang;
  }

  // Render content
  renderContent(currentLang);

  // Initialize interactive 3D Emblem
  init3DEmblem();

  // Setup Language Button
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) langBtn.addEventListener('click', toggleLanguage);

  // Setup Mobile Nav Burger
  const burger = document.getElementById('nav-burger');
  if (burger) burger.addEventListener('click', toggleMobileNav);

  // Close drawer on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const drawer = document.getElementById('mobile-nav');
      if (drawer && drawer.classList.contains('is-open')) {
        toggleMobileNav();
      }
    });
  });

  // Sticky Nav solid state on scroll
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Lightbox close bindings
  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
