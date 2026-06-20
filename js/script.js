// =========================================================
// MOBILE NAV TOGGLE
// =========================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navbarEl = document.getElementById('navbar');
const navBackdrop = document.getElementById('navBackdrop');
const MOBILE_BREAKPOINT = 992;

// keep the dropdown's top offset matched to the navbar's real height
// (fixes any gap/overlap caused by a hardcoded px value)
function setNavbarHeightVar() {
  document.documentElement.style.setProperty('--navbar-h', `${navbarEl.offsetHeight}px`);
}
setNavbarHeightVar();
window.addEventListener('resize', setNavbarHeightVar);
window.addEventListener('load', setNavbarHeightVar);

function openMenu() {
  hamburger.classList.add('is-active');
  navLinks.classList.add('is-open');
  navBackdrop.classList.add('is-open');
  document.documentElement.classList.add('menu-open'); // locks background scroll while menu is open
}

function closeMenu() {
  hamburger.classList.remove('is-active');
  navLinks.classList.remove('is-open');
  navBackdrop.classList.remove('is-open');
  document.documentElement.classList.remove('menu-open');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('is-open');
  isOpen ? closeMenu() : openMenu();
});

// tapping the dimmed backdrop closes the menu
navBackdrop.addEventListener('click', closeMenu);

// Escape key closes the menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Robust breakpoint detection: fires exactly once when the viewport
// genuinely crosses the mobile/desktop boundary (matches the CSS media
// query precisely).
//
// Real cause of the "menu flashes open then closes itself" glitch:
// `.nav-links` has a CSS transition on opacity/transform so the menu can
// animate in/out. The moment the viewport crosses the breakpoint, those
// same properties jump from their desktop values (visible, normal flow)
// to their mobile closed-state values (opacity 0, hidden) — and because
// the transition is still "live" on the element, the browser animates
// that jump too, which *looks* like the menu opening and then closing on
// its own, even though nothing was clicked. Fix: briefly disable the
// transition right as the breakpoint changes, so only real user clicks
// (open/close via the hamburger) ever animate.
const desktopMedia = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`);

function handleBreakpointChange(e) {
  navLinks.classList.add('no-transition');
  navBackdrop.classList.add('no-transition');

  if (e.matches) closeMenu();

  // let the instant (non-animated) style apply, then restore the
  // transition so the next real click animates normally again
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      navLinks.classList.remove('no-transition');
      navBackdrop.classList.remove('no-transition');
    });
  });
}

desktopMedia.addEventListener('change', handleBreakpointChange);




// =========================================================
// ANIMATE SKILL BARS ON SCROLL INTO VIEW
// =========================================================
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar__fill');
      const percent = entry.target.getAttribute('data-percent');
      fill.style.width = `${percent}%`;
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

const servicesTrack = document.getElementById('servicesTrack');
const servicesPrev = document.getElementById('servicesPrev');
const servicesNext = document.getElementById('servicesNext');

function scrollTrack(track, dir) {
  const card = track.querySelector('.service-card');
  const distance = card ? card.offsetWidth + 22 : 280;
  track.scrollBy({ left: dir * distance, behavior: 'smooth' });
}

servicesPrev.addEventListener('click', () => scrollTrack(servicesTrack, -1));
servicesNext.addEventListener('click', () => scrollTrack(servicesTrack, 1));

const certTrack = document.getElementById('certTrack');
const certPrev = document.getElementById('certPrev');
const certNext = document.getElementById('certNext');

function scrollCertTrack(dir) {
  const card = certTrack.querySelector('.cert-card');
  const distance = card ? card.offsetWidth + 24 : 320;
  certTrack.scrollBy({ left: dir * distance, behavior: 'smooth' });
}

certPrev.addEventListener('click', () => scrollCertTrack(-1));
certNext.addEventListener('click', () => scrollCertTrack(1));

// =========================================================
// PROJECTS FILTER
// =========================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

const navItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});
