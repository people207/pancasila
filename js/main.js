// ===== MAIN MODULE =====

// ---- SCROLL PROGRESS BAR ----
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

// ---- STICKY NAVBAR ----
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });

  // Active link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: `-${68}px 0px 0px 0px` });

  sections.forEach(s => observer.observe(s));
}

// ---- HAMBURGER MENU ----
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
    });
  });
}

// ---- DARK MODE ----
function initDarkMode() {
  const btn = document.getElementById('darkToggle');
  if (!btn) return;

  // Load saved preference
  const saved = localStorage.getItem('pancasila-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pancasila-theme', next);
  });
}

// ---- REVEAL ON SCROLL ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ---- BACK TO TOP ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- SMOOTH ANCHOR SCROLL ----
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ---- ANIMATE BARS ON SCROLL ----
function initBars() {
  const bars = document.querySelectorAll('.gap-fill, .bar');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => {
    b.style.animationPlayState = 'paused';
    observer.observe(b);
  });
}

// ---- CAMP PROGRESS ANIMATION ----
function initCampProgress() {
  const camps = document.querySelectorAll('.camp-progress div');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const w   = el.style.width;
        el.style.width = '0';
        setTimeout(() => { el.style.transition = 'width 1.2s ease'; el.style.width = w; }, 100);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  camps.forEach(c => observer.observe(c));
}

// ---- CARD TILT MICRO-INTERACTION ----
function initCardTilt() {
  document.querySelectorAll('.conclusion-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- TYPEWRITER EFFECT (Home subtitle) ----
function initTypewriter() {
  const el = document.querySelector('.home-subtitle');
  if (!el) return;
  // Only on first load, after reveal
  const orig = el.innerHTML;
  el.dataset.original = orig;
}

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHamburger();
  initDarkMode();
  initReveal();
  initBackToTop();
  initAnchorScroll();
  initBars();
  initCampProgress();
  initCardTilt();
  initTypewriter();

  // Re-run reveal for dynamically added content
  window.addEventListener('load', initReveal);
});