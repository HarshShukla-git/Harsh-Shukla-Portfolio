// ====== Theme toggle (persist + system fallback) ======
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

// apply theme: if saved === 'dark' OR (no saved and system prefers dark) => dark, else light (no attribute)
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.removeAttribute('data-theme');
}

function renderThemeButton() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}
renderThemeButton();

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    // switch to light
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    // switch to dark
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  renderThemeButton();
});

// ====== Mobile nav toggle ======
const navToggle = document.getElementById('nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
  });
}

// ====== Smooth scroll & active nav highlight ======
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navList && navList.classList.contains('open')) navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  });
});

// Use sections (with ids) for highlighting - includes main cards/sections
const sections = document.querySelectorAll('main .section, main section.card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const id = entry.target.id;
      if (id) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.card, .section').forEach(el => observer.observe(el));

// ====== Progress bar & back-to-top ======
const progressBar = document.getElementById('progress-bar');
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (window.scrollY / (docH <= 0 ? 1 : docH)) * 100;
  progressBar.style.width = pct + '%';
  backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ====== Project filtering ======
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || filter === cat) card.style.display = '';
      else card.style.display = 'none';
    });
  });
});

// ====== Reduced motion handling ======
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.card, .section').forEach(el => el.classList.add('visible'));
}
