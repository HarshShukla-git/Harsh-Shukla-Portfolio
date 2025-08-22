/* ========== Theme toggle (persist) ========== */
const themeToggle = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

function updateThemeButton() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.textContent = isLight ? 'Light' : 'Dark';
  themeToggle.setAttribute('aria-pressed', String(isLight));
}
updateThemeButton();

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
  updateThemeButton();
});

/* ========== Mobile nav toggle ========== */
const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('primary-navigation');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

/* ========== Smooth scroll & active nav highlight ========== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main .section, main section.card');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close mobile nav when link clicked
    if (nav.classList.contains('open')) nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* highlight active nav on scroll */
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { root: null, threshold: 0.45 });

sections.forEach(s => {
  if (s.id) navObserver.observe(s);
});

/* ========== Scroll reveal for cards/sections ========== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .section').forEach(el => revealObserver.observe(el));

/* ========== Progress bar & back-to-top ========== */
const progressBar = document.getElementById('progress-bar');
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (window.scrollY / (docH <= 0 ? 1 : docH)) * 100;
  progressBar.style.width = pct + '%';
  backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ========== Project filtering ========== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || filter === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ========== Respect reduced motion (optional skip animations) ========== */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Remove reveal observer animations if user prefers reduced motion
  document.querySelectorAll('.card, .section').forEach(el => { el.classList.add('visible'); });
}

