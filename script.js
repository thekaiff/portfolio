/* =============================================
   SCRIPT.JS — Kaif Portfolio
   Enhanced: Custom cursor, page loader, magnetic
   buttons, scroll reveal, story scroll, tech bars,
   nav active, form handler, back to top
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 0. PAGE LOADER
  // =============================================
  const loader = document.getElementById('pageLoader');
  if (loader) {
    // Hide loader after CSS animation completes (~1.4s)
    setTimeout(() => {
      loader.classList.add('done');
      // Trigger reveal on visible elements after load
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 1500);
  }


  // =============================================
  // 1. CUSTOM CURSOR
  // =============================================
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';
    });

    // Ring follows with smooth lag
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity  = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
    });

    // Grow ring on clickable elements
    document.querySelectorAll('a, button, .bento-card, .project-card, .story-dot, .tech-category, .about-chips span').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
        cursorRing.style.width     = '56px';
        cursorRing.style.height    = '56px';
        cursorRing.style.borderColor = 'rgba(107,144,128,0.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.width     = '36px';
        cursorRing.style.height    = '36px';
        cursorRing.style.borderColor = 'rgba(45,45,42,0.35)';
      });
    });

    // Press state
    document.addEventListener('mousedown', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(0.7)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  }


  // =============================================
  // 2. MAGNETIC BUTTON EFFECT
  // =============================================
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) * 0.28;
      const deltaY  = (e.clientY - centerY) * 0.28;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  // =============================================
  // 3. FLOATING NAV — scroll shadow + active links
  // =============================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  // =============================================
  // 4. MOBILE BURGER MENU
  // =============================================
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  navBurger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navBurger.classList.toggle('open', isOpen);
    navBurger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      navBurger.classList.remove('open');
    }
  });


  // =============================================
  // 5. TEXT SLIDER (Hero card role rotator)
  // =============================================
  const slider = document.getElementById('textSlider');
  const slides  = slider ? slider.querySelectorAll('.slide') : [];
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      slider.style.transform = `translateY(-${currentSlide * 22}px)`;
    }, 2400);
  }


  // =============================================
  // 6. SCROLL REVEAL — Intersection Observer
  // =============================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });


  // =============================================
  // 7. SMOOTH SCROLL — Anchor links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // =============================================
  // 8. NAV ACTIVE LINK HIGHLIGHT on scroll
  // =============================================
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          a.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.color = 'var(--accent-mid)';
          activeLink.classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));


  // =============================================
  // 9. STORYTELLING STICKY SCROLL
  // =============================================
  const storyStepsEl = document.querySelectorAll('.story-step');
  const storyVisuals = document.querySelectorAll('.sv');
  const storyDotEls  = document.querySelectorAll('.story-dot');
  const spineFill    = document.getElementById('spineFill');
  const storyCounter = document.getElementById('storyCountCurrent');

  function activateStep(index) {
    storyStepsEl.forEach((s, i) => s.classList.toggle('active', i === index));
    storyVisuals.forEach((v, i) => v.classList.toggle('active', i === index));
    storyDotEls.forEach((d, i)  => d.classList.toggle('active', i === index));
    if (spineFill)    spineFill.style.height = `${((index + 1) / storyStepsEl.length) * 100}%`;
    if (storyCounter) storyCounter.textContent = String(index + 1).padStart(2, '0');
  }

  if (storyStepsEl.length) activateStep(0);

  storyDotEls.forEach(dot => {
    dot.addEventListener('click', () => activateStep(+dot.dataset.step));
  });

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activateStep(+entry.target.dataset.step);
    });
  }, { threshold: 0.55, rootMargin: '-10% 0px -30% 0px' });

  storyStepsEl.forEach(step => storyObserver.observe(step));


  // =============================================
  // 10. TECH BARS — Animate on scroll into view
  // =============================================
  const techCategories = document.querySelectorAll('.tech-category');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('bar-animated')) {
        entry.target.querySelectorAll('.tp-bar div').forEach((bar, i) => {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, i * 60 + 100);
        });
        entry.target.classList.add('bar-animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  techCategories.forEach(cat => barObserver.observe(cat));


  // =============================================
  // 11. CONTACT FORM — Web3Forms integration
  // =============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn          = contactForm.querySelector('button[type="submit"]');
      const btnSpan      = btn.querySelector('span') || btn;
      const originalHTML = btn.innerHTML;

      btn.disabled    = true;
      btn.style.opacity = '0.75';
      btnSpan.textContent = 'Sending…';

      const formData = new FormData(contactForm);
      const object   = Object.fromEntries(formData);
      const json     = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: json
        });
        const result = await response.json();

        if (result.success) {
          btn.style.background = '#3d6a52';
          btn.style.opacity    = '1';
          btnSpan.textContent  = 'Message Sent ✓';
          setTimeout(() => {
            btn.innerHTML        = originalHTML;
            btn.disabled         = false;
            btn.style.background = '';
            contactForm.reset();
          }, 3200);
        } else {
          throw new Error(result.message || 'API error');
        }
      } catch (err) {
        btn.style.background = '#b94040';
        btn.style.opacity    = '1';
        btnSpan.textContent  = 'Something went wrong — try again';
        setTimeout(() => {
          btn.innerHTML        = originalHTML;
          btn.disabled         = false;
          btn.style.background = '';
        }, 3200);
      }
    });

    // Live input focus accent line
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('focus', () => {
        field.parentElement.style.setProperty('--focus', '1');
      });
      field.addEventListener('blur', () => {
        field.parentElement.style.removeProperty('--focus');
      });
    });
  }


  // =============================================
  // 12. BACK TO TOP
  // =============================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // =============================================
  // 13. HERO CARD — Subtle tilt on mouse move
  // =============================================
  const heroCard = document.querySelector('.hero-card');
  if (heroCard && window.matchMedia('(pointer: fine)').matches) {
    const heroRight = document.querySelector('.hero-right');
    heroRight && heroRight.addEventListener('mousemove', (e) => {
      const rect    = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  4;
      heroCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    heroRight && heroRight.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }


  // =============================================
  // 14. BENTO CARDS — Spotlight hover effect
  // =============================================
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });


  // =============================================
  // 15. PROJECT CARDS — Parallax visual on hover
  // =============================================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -2.5;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  2.5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // =============================================
  // 16. SECTION PROGRESS — thin top bar
  // =============================================
  const progressBar = document.createElement('div');
  progressBar.id = 'scrollProgress';
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(to right, #6b9080, #2d2d2a);
    z-index: 9999; transition: width 0.1s linear; pointer-events: none;
    box-shadow: 0 0 8px rgba(107,144,128,0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });


  // =============================================
  // 17. FOOTER LINKS — Stagger on hover
  // =============================================
  document.querySelectorAll('.footer-col ul').forEach(ul => {
    ul.querySelectorAll('a').forEach((a, i) => {
      a.style.transitionDelay = `${i * 30}ms`;
    });
  });

}); // end DOMContentLoaded
