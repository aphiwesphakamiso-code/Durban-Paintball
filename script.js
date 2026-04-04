/* ============================================================
   DURBAN PAINTBALL — script.js
   ============================================================ */

// ── Crosshair cursor ──────────────────────────────────────────
const cursorOuter = document.querySelector('.cursor-outer');
const cursorInner = document.querySelector('.cursor-inner');

if (cursorOuter && cursorInner) {
  let mx = -100, my = -100;
  let ox = -100, oy = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorInner.style.left = mx + 'px';
    cursorInner.style.top  = my + 'px';
  });

  // Outer ring lags slightly for feel
  function animateCursor() {
    ox += (mx - ox) * 0.14;
    oy += (my - oy) * 0.14;
    cursorOuter.style.left = ox + 'px';
    cursorOuter.style.top  = oy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on hoverable elements
  const hoverables = 'a, button, .service-card, .pricing-card, .review-card, .rule-item, .contact-card, .lt-feature, .step-card';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => cursorOuter.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hovering'));
  });
}

// ── Nav scroll ────────────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const [s1, s2, s3] = toggle.querySelectorAll('span');
  s1.style.transform  = isOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
  s2.style.opacity    = isOpen ? '0' : '';
  s3.style.transform  = isOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    toggle?.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

// ── Active nav link ────────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Scroll reveal ──────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
  revealObs.observe(el);
});

// ── Count-up numbers ───────────────────────────────────────────
function countUp(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || e.target.dataset.done) return;
    e.target.dataset.done = '1';
    countUp(
      e.target,
      parseFloat(e.target.dataset.count),
      e.target.dataset.suffix || '',
      1800
    );
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── Hero parallax ──────────────────────────────────────────────
const heroBg = document.querySelector('.hero-photo');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

// ── Bullet-impact ripple on CTA buttons ───────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleOut 0.55s ease-out forwards;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframe
const rkf = document.createElement('style');
rkf.textContent = '@keyframes rippleOut { to { transform: scale(1); opacity: 0; } }';
document.head.appendChild(rkf);

// ── Reticle rotation speed on scroll ──────────────────────────
const reticle = document.querySelector('.hero-reticle');
if (reticle) {
  let deg = 0;
  window.addEventListener('scroll', () => {
    deg = window.scrollY * 0.04;
    reticle.style.transform = `translateY(-50%) rotate(${deg}deg)`;
  }, { passive: true });
}
