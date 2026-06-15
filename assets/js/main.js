/* =============================================
   Main JavaScript - Scroll Animations & Interactions
   ============================================= */

(function () {
  'use strict';

  // ---- Navigation Scroll Effect ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Mobile Menu Toggle ----
  navToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  window.closeMenu = function () {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  // ---- Intersection Observer for Scroll Reveals ----
  function setupScrollReveal() {
    const elements = document.querySelectorAll('.fade-up');

    // Skip hero elements (they use CSS animation)
    const heroElements = document.querySelectorAll('.hero .fade-up');
    const heroSet = new Set(heroElements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => {
      if (heroSet.has(el)) return; // Skip hero, let CSS handle it
      el.classList.remove('fade-up');
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Number Counter Animation ----
  function animateNumber(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function setupNumberAnimations() {
    const numbers = document.querySelectorAll('.about-number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    numbers.forEach((el) => observer.observe(el));
  }

  // ---- Magnetic Hover for Project Cards ----
  function setupMagneticCards() {
    const cards = document.querySelectorAll('.project-card, .about-card, .contact-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y * 0.02}deg) rotateY(${x * 0.02}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Skill Tag Hover Ripple ----
  function setupSkillTags() {
    document.querySelectorAll('.skill-tag').forEach((tag) => {
      tag.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
      });
      tag.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    setupScrollReveal();
    setupNumberAnimations();
    setupMagneticCards();
    setupSkillTags();
  });
})();
