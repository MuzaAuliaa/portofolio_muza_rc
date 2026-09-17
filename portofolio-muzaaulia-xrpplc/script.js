/**
 * MUZA AULIA SARI — Personal Portfolio Script
 * Handles mobile hamburger navigation, header offset compensation,
 * smooth scroll transitions, and viewport entrance animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initSmoothScrollOffsets();
  initActiveNavHighlight();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileDrawer) return;

  function toggleMenu(open) {
    const isCurrentlyExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = open !== undefined ? open : !isCurrentlyExpanded;

    menuToggle.setAttribute('aria-expanded', String(nextState));
    mobileDrawer.setAttribute('aria-hidden', String(!nextState));
    mobileDrawer.classList.toggle('is-open', nextState);

    // Prevent background scrolling while modal drawer is open
    document.body.style.overflow = nextState ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => {
    toggleMenu();
  });

  // Close drawer when any mobile link is tapped
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close drawer on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });

  // Auto-close on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && menuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });
}

/**
 * Intersection Observer for Entrance Reveal Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -36px 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Anchor Smooth Scrolling with Header Offset Compensation
 */
function initSmoothScrollOffsets() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetId === '#hero' ? 0 : targetPosition,
          behavior: 'smooth',
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/**
 * Active Navigation Link Highlighter based on Scroll Position
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section, footer');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, { passive: true });
}
