/* =============================================
   Main JavaScript - Enhanced Interactions
   ============================================= */

(function () {
  'use strict';

  // ---- Custom Cursor ----
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effect on interactive elements
  const hoverTargets = 'a, button, .btn, .project-card, .about-card, .contact-card, .skill-tag, .timeline-content';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => cursorDot.classList.add('click'));
  document.addEventListener('mouseup', () => cursorDot.classList.remove('click'));

  // ---- Scroll Progress Bar ----
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // ---- Noise Overlay ----
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  document.body.appendChild(noise);

  // ---- Navigation Scroll Effect ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function handleNavScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateProgress();
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

  // ---- Intersection Observer for Scroll Reveals ----
  function setupScrollReveal() {
    const elements = document.querySelectorAll('.fade-up');
    const heroElements = new Set(document.querySelectorAll('.hero .fade-up'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    elements.forEach((el) => {
      if (heroElements.has(el)) return;
      el.classList.remove('fade-up');
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ---- Number Counter Animation ----
  function animateNumber(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Elastic easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * ((2 * Math.PI) / 3));
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

  // ---- Magnetic Hover for Cards ----
  function setupMagneticCards() {
    const cards = document.querySelectorAll('.project-card, .about-card, .contact-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 0.015}deg) rotateY(${x * 0.015}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  // ---- Parallax on Hero ----
  function setupHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const progress = scrollY / window.innerHeight;
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - progress * 1.2;
      }
    }, { passive: true });
  }

  // ---- Text Scramble Effect ----
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span style="color:var(--accent);opacity:0.6">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  function setupTextScramble() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const originalText = heroName.textContent;
    const scramble = new TextScramble(heroName);

    // Initial scramble on load
    setTimeout(() => {
      scramble.setText(originalText);
    }, 600);

    // Re-scramble on hover
    heroName.addEventListener('mouseenter', () => {
      scramble.setText(originalText);
    });
  }

  // ---- Tilt Effect on Hero Section ----
  function setupHeroTilt() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--tilt-x', `${y * 3}deg`);
      hero.style.setProperty('--tilt-y', `${-x * 3}deg`);
    });
  }

  // ---- Skill Tag Ripple Effect ----
  function setupSkillTags() {
    document.querySelectorAll('.skill-tag').forEach((tag) => {
      tag.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0; height: 0;
          border-radius: 50%;
          background: rgba(0, 113, 227, 0.2);
          transform: translate(-50%, -50%);
          left: ${e.clientX - rect.left}px;
          top: ${e.clientY - rect.top}px;
          animation: rippleOut 0.6s ease-out forwards;
          pointer-events: none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple keyframes
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleOut {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- Timeline Stagger Animation ----
  function setupTimelineStagger() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => {
      item.classList.add('reveal');
      observer.observe(item);
    });
  }

  // ---- Card Spotlight Effect ----
  function setupSpotlight() {
    const cards = document.querySelectorAll('.project-card, .about-card, .skill-category');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 113, 227, 0.04), transparent 40%), var(--card-bg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }

  // ---- Smooth Section Transitions ----
  function setupSectionTransitions() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.05 }
    );

    sections.forEach((section) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(section);
    });
  }

  // ---- Typing Effect for Hero Title ----
  function setupTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--accent)';

    let i = 0;
    function type() {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(type, 60 + Math.random() * 40);
      } else {
        // Blink cursor then remove
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1500);
      }
    }

    setTimeout(type, 1200);
  }

  // ---- Mesh Blob Mouse Parallax ----
  function setupMeshParallax() {
    const blobs = document.querySelectorAll('.mesh-blob');
    if (!blobs.length) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateBlobs() {
      currentX += (targetX - currentX) * 0.02;
      currentY += (targetY - currentY) * 0.02;

      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 12;
        const rotateFactor = (i + 1) * 2;
        blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px) rotate(${currentX * rotateFactor}deg)`;
      });

      requestAnimationFrame(animateBlobs);
    }
    animateBlobs();
  }

  // ---- Floating Particles in Hero ----
  function setupParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let mouseParticle = null;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(isMouse) {
        this.isMouse = isMouse || false;
        if (!this.isMouse) this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? 240 : 270; // indigo or purple
      }
      update(mx, my) {
        if (this.isMouse) {
          this.x = mx;
          this.y = my;
          return;
        }
        this.x += this.speedX;
        this.y += this.speedY;

        // Attract toward mouse
        if (mx !== undefined && my !== undefined) {
          const dx = mx - this.x;
          const dy = my - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            this.x += dx * 0.002;
            this.y += dy * 0.002;
          }
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 55%, ${this.opacity})`;
        ctx.fill();

        // Glow effect
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.hue}, 80%, 55%, ${this.opacity * 0.1})`;
          ctx.fill();
        }
      }
    }

    // Create particles
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
    mouseParticle = new Particle(true);
    mouseParticle.size = 4;
    mouseParticle.opacity = 0.5;
    mouseParticle.hue = 210;

    let heroMouseX, heroMouseY;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      heroMouseX = e.clientX - rect.left;
      heroMouseY = e.clientY - rect.top;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const hue = particles[i].hue;
            ctx.strokeStyle = `hsla(240, 70%, 60%, ${0.08 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse particle
        if (heroMouseX !== undefined) {
          const dx = particles[i].x - heroMouseX;
          const dy = particles[i].y - heroMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(heroMouseX, heroMouseY);
            ctx.strokeStyle = `rgba(0, 113, 227, ${0.12 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => p.update(heroMouseX, heroMouseY));
      particles.forEach((p) => p.draw());

      // Draw mouse particle glow
      if (heroMouseX !== undefined) {
        ctx.beginPath();
        ctx.arc(heroMouseX, heroMouseY, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 113, 227, 0.03)';
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });
  }

  // ---- Smooth Anchor Highlighting ----
  function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-64px 0px -40% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ---- Gallery Lightbox ----
  function setupGalleryLightbox() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    if (!galleryCards.length) return;

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
        <button class="lightbox-close" aria-label="关闭">&times;</button>
        <div class="lightbox-nav">
          <button class="lightbox-prev" aria-label="上一张">‹</button>
          <button class="lightbox-next" aria-label="下一张">›</button>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    const images = [];

    galleryCards.forEach((card, i) => {
      const img = card.querySelector('img');
      if (img) images.push(img.src);
      card.addEventListener('click', () => {
        currentIndex = i;
        openLightbox(images[currentIndex]);
      });
    });

    function openLightbox(src) {
      lbImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

    lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lbImg.src = images[currentIndex];
    });

    lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      lbImg.src = images[currentIndex];
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });

    // Lightbox styles
    if (!document.getElementById('lightbox-style')) {
      const style = document.createElement('style');
      style.id = 'lightbox-style';
      style.textContent = `
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .lightbox.active {
          opacity: 1;
          pointer-events: auto;
        }
        .lightbox-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
        }
        .lightbox-content {
          position: relative;
          max-width: 80vw;
          max-height: 85vh;
          z-index: 1;
          transform: scale(0.9);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .lightbox.active .lightbox-content {
          transform: scale(1);
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
          object-fit: contain;
        }
        .lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 32px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .lightbox-close:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          left: -60px;
          right: -60px;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }
        .lightbox-prev, .lightbox-next {
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }
        .lightbox-prev:hover, .lightbox-next:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .lightbox-content { max-width: 95vw; }
          .lightbox-nav { left: -10px; right: -10px; }
          .lightbox-prev, .lightbox-next { width: 36px; height: 36px; font-size: 18px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- Character Float Animation ----
  function setupCharacterFloat() {
    const characters = document.querySelectorAll('.character-img');
    characters.forEach((char, i) => {
      // Add floating animation with different delays
      char.style.animation = `characterFloat ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`;

      // Parallax on mouse move
      const parent = char.closest('.hero-character, .about-character, .contact-character');
      if (parent) {
        parent.addEventListener('mousemove', (e) => {
          const rect = parent.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          char.style.transform = `translateY(${y * -10}px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
        });
        parent.addEventListener('mouseleave', () => {
          char.style.transform = '';
          char.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
          setTimeout(() => { char.style.transition = ''; }, 600);
        });
      }
    });

    // Add float keyframes
    if (!document.getElementById('char-float-style')) {
      const style = document.createElement('style');
      style.id = 'char-float-style';
      style.textContent = `
        @keyframes characterFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    setupScrollReveal();
    setupNumberAnimations();
    setupMagneticCards();
    setupHeroParallax();
    setupTextScramble();
    setupMeshParallax();
    setupCharacterFloat();
    setupGalleryLightbox();
    setupHeroTilt();
    setupSkillTags();
    setupTimelineStagger();
    setupSpotlight();
    setupSectionTransitions();
    setupTypingEffect();
    setupParticles();
    setupActiveNav();
  });
})();
