/* ============================================
   PORTFOLIO JS — CORE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCursor();
  initTyped();
  initCounters();
  initMobileMenu();
  initActiveNav();
});

/* ── Navigation ─────────────────────────────── */
function initNav() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Hide/show nav on scroll
    if (current > 200) {
      if (current > lastScroll) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    } else {
      nav.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  });
}

/* ── Active Nav Link ─────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ── Scroll Reveal ──────────────────────────── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate progress bars if inside
        const bars = entry.target.querySelectorAll('.progress-fill');
        bars.forEach(bar => {
          const target = bar.getAttribute('data-width');
          if (target) {
            setTimeout(() => { bar.style.width = target; }, 200);
          }
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));

  // Also observe progress bars directly
  const progBars = document.querySelectorAll('.progress-fill');
  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.getAttribute('data-width');
        if (target) {
          setTimeout(() => { entry.target.style.width = target; }, 300);
        }
        progObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  progBars.forEach(bar => progObserver.observe(bar));
}

/* ── Custom Cursor ──────────────────────────── */
function initCursor() {
  if (window.innerWidth < 768) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX - 3 + 'px';
    dot.style.top   = mouseY - 3 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX - 15 + 'px';
    ring.style.top  = ringY - 15 + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'scale(2.5)';
      ring.style.transform = 'scale(1.6)';
      ring.style.borderColor = 'var(--orange)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'scale(1)';
      ring.style.transform = 'scale(1)';
      ring.style.borderColor = 'rgba(255,107,53,0.5)';
    });
  });
}

/* ── Typed Text ─────────────────────────────── */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'Flutter Developer',
    'Full Stack Engineer',
    'Mobile App Builder',
    'UI/UX Implementer',
    'MLOps Engineer'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    if (pause) return;
    const current = words[wordIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIdx === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}

/* ── Animated Counters ──────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        function update() {
          start = Math.min(start + step, target);
          el.textContent = Math.floor(start) + suffix;
          if (start < target) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Mobile Menu ────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  const links  = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Smooth scroll offset ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
