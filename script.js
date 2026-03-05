/* =============================================
   SCRIPT.JS — Data Analyst Portfolio
   Handles: Nav scroll, Mobile menu, Text Slider,
            Scroll Reveal, Back to Top, Form
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. FLOATING NAV — Scroll shadow + active links
  // =============================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // =============================================
  // 2. MOBILE BURGER MENU
  // =============================================
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  navBurger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });


  // =============================================
  // 3. TEXT SLIDER (Hero card role rotator)
  // =============================================
  const slider = document.getElementById('textSlider');
  const slides  = slider ? slider.querySelectorAll('.slide') : [];
  let currentSlide = 0;

  if (slides.length > 1) {
    setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;

      // Move the flex column up by one slide height (22px)
      slider.style.transform = `translateY(-${nextSlide * 22}px)`;
      currentSlide = nextSlide;
    }, 2200);
  }


// =============================================
  // 4. SCROLL REVEAL — Intersection Observer
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
    rootMargin: '0px 0px 0px 0px'
  });

  // Immediately reveal anything already visible in the viewport on load
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
  // 5. SMOOTH SCROLL — Anchor links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // account for floating nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // =============================================
  // 6. CONTACT FORM — Basic validation + feedback
  // =============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Loading state
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Collect form data and send to Web3Forms
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (result.success) {
        // Success state
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#4a7c3f';
        btn.style.opacity = '1';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);

      } else {
        // API returned an error
        btn.textContent = 'Something went wrong';
        btn.style.background = '#c0392b';
        btn.style.opacity = '1';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }

    } catch (error) {
      // Network error
      btn.textContent = 'Network error — try again';
      btn.style.background = '#c0392b';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }
  });
}


  // =============================================
  // 7. BACK TO TOP — Smooth scroll
  // =============================================
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // =============================================
  // 8. STICKY LEFT PANEL — Subtle parallax hint
  //    (CSS handles the sticky; JS adds subtle
  //     progress indicator on sticky image)
  // =============================================
  const stickyLeft  = document.querySelector('.sticky-left');
  const stickyRight = document.querySelector('.sticky-right');

  if (stickyLeft && stickyRight) {
    const steps = stickyRight.querySelectorAll('.sticky-step');

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Highlight active step label in left panel
          const label = stickyLeft.querySelector('.sticky-label-tag');
          if (label) {
            const stepTitle = entry.target.querySelector('.step-title');
            if (stepTitle) label.textContent = stepTitle.textContent;
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-20% 0px -20% 0px'
    });

    steps.forEach(step => stepObserver.observe(step));
  }


  // =============================================
  // 9. NAV ACTIVE LINK HIGHLIGHT on scroll
  // =============================================
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.style.color = 'var(--accent)';
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));

  // =============================================
  // STORYTELLING STICKY SCROLL
  // =============================================
  const storyStepsEl   = document.querySelectorAll('.story-step');
  const storyVisuals   = document.querySelectorAll('.sv');
  const storyDotEls    = document.querySelectorAll('.story-dot');
  const spineFill      = document.getElementById('spineFill');
  const storyCounter   = document.getElementById('storyCountCurrent');

  function activateStep(index) {
    // Steps
    storyStepsEl.forEach((s, i) => s.classList.toggle('active', i === index));
    // Visuals
    storyVisuals.forEach((v, i) => v.classList.toggle('active', i === index));
    // Dots
    storyDotEls.forEach((d, i) => d.classList.toggle('active', i === index));
    // Spine fill
    if (spineFill) spineFill.style.height = `${((index + 1) / storyStepsEl.length) * 100}%`;
    // Counter
    if (storyCounter) storyCounter.textContent = String(index + 1).padStart(2, '0');
  }

  // Activate first step on load
  if (storyStepsEl.length) activateStep(0);

  // Dot click navigation
  storyDotEls.forEach(dot => {
    dot.addEventListener('click', () => activateStep(+dot.dataset.step));
  });

  // Scroll-driven activation
  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateStep(+entry.target.dataset.step);
      }
    });
  }, { threshold: 0.55, rootMargin: '-10% 0px -30% 0px' });

  storyStepsEl.forEach(step => storyObserver.observe(step));

  // =============================================
  // TECH BARS — Animate on scroll into view
  // =============================================
  const techCategories = document.querySelectorAll('.tech-category');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('bar-animated')) {
        // Set CSS custom property then trigger transition
        entry.target.querySelectorAll('.tp-bar div').forEach(bar => {
          bar.style.setProperty('--target-width', bar.style.width);
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.width = bar.style.getPropertyValue('--target-width') ||
                                bar.getAttribute('style').match(/width:([\d%]+)/)?.[1] || '0%';
            });
          });
        });
        entry.target.classList.add('bar-animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  techCategories.forEach(cat => barObserver.observe(cat));

}); // end DOMContentLoaded
