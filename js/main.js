'use strict';

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
mobileMenu.querySelectorAll('.mob-link, .btn').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ── Animated counters ── */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const stepVal = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + stepVal, target);
    el.textContent = Math.floor(current).toLocaleString('ar-MA');
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const counterEls = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(animateCounter);
    }
  }, { threshold: 0.5 }).observe(heroStats);
}

/* ── Add reveal to cards ── */
document.querySelectorAll('.subject-card,.step,.feature-card,.teacher-card,.testi-card,.price-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  observer.observe(el);
});

/* ── Pricing toggle ── */
const prices = {
  annual:  { p1:'67',  p2:'83',  p3:'117', b1:'محاسبة سنوية — 799 درهم',  b2:'محاسبة سنوية — 999 درهم', b3:'محاسبة سنوية — 1,399 درهم (3 تلاميذ)' },
  monthly: { p1:'99',  p2:'149', p3:'199', b1:'محاسبة شهرية',              b2:'محاسبة شهرية',             b3:'محاسبة شهرية (3 تلاميذ)' },
};
function animatePrice(el, target) {
  const start = +el.textContent.replace(/,/g,'');
  const t0 = performance.now();
  (function upd(now) {
    const p = Math.min((now - t0) / 400, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * e);
    if (p < 1) requestAnimationFrame(upd);
  })(t0);
}
window.toggleBilling = function(plan) {
  const d = prices[plan];
  ['1','2','3'].forEach(i => {
    const n = document.getElementById('p'+i), b = document.getElementById('pb'+i);
    if (n) animatePrice(n, +d['p'+i]);
    if (b) b.textContent = d['b'+i];
  });
  document.getElementById('pt-annual').classList.toggle('active', plan==='annual');
  document.getElementById('pt-monthly').classList.toggle('active', plan==='monthly');
};

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 76, behavior:'smooth' }); }
  });
});

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href')==='#'+cur ? 'var(--teal)' : ''; });
}, { passive: true });
