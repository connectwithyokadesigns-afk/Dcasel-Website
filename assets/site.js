/*!
 * Dcasel — Shared Site Logic
 * Handles: nav, mobile menu, scroll reveal, counters, dropdowns,
 *          progress bar, active nav links, smooth anchors, keyboard traps,
 *          toast notifications, form validation, back-to-top.
 */
(function () {
  'use strict';

  /* ─── Helpers ──────────────────────────────────────────── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const isMob = () => window.innerWidth < 900;
  const isTouch = !window.matchMedia('(pointer:fine)').matches;

  /* ─── Scroll Progress Bar ──────────────────────────────── */
  const prog = $('#prog');
  if (prog) {
    const updateProg = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', updateProg, { passive: true });
    updateProg();
  }

  /* ─── Sticky Nav + Dark Nav Detection ─────────────────── */
  const nav = $('#nav');
  if (nav) {
    const darkSections = ['work', 'process', 'why', 'about', 'reviews'];
    const updateNav = () => {
      nav.classList.toggle('stuck', window.scrollY > 30);
      const dark = darkSections.some(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < 80 && r.bottom > 0;
      });
      nav.classList.toggle('dnav', dark);
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ─── Active Nav Link (current page) ──────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-drop a, .ft-col a').forEach(a => {
    try {
      const href = a.getAttribute('href') || '';
      const page = href.split('/').pop().split('#')[0];
      if (page && page === currentPage) a.classList.add('active');
    } catch (_) {}
  });

  /* ─── Hamburger / Mobile Menu ──────────────────────────── */
  const hamBtn = $('#hamBtn');
  const mobMenu = $('#mobMenu');
  let menuOpen = false;

  const openMenu = () => {
    menuOpen = true;
    hamBtn?.classList.add('open');
    mobMenu?.classList.add('open');
    hamBtn?.setAttribute('aria-expanded', 'true');
    mobMenu?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first link for accessibility
    setTimeout(() => {
      const first = mobMenu?.querySelector('a, button');
      first?.focus();
    }, 100);
  };

  const closeMenu = () => {
    menuOpen = false;
    hamBtn?.classList.remove('open');
    mobMenu?.classList.remove('open');
    hamBtn?.setAttribute('aria-expanded', 'false');
    mobMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamBtn?.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));

  // Close on any mobile link click
  $$('.mm, .mob-links a, .mob-btn').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (menuOpen) closeMenu();
      // Close dropdowns
      $$('.nav-drop.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.nav-item')?.classList.remove('drop-open');
      });
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (menuOpen && !mobMenu?.contains(e.target) && e.target !== hamBtn) {
      closeMenu();
    }
  });

  /* ─── Desktop Dropdown Menus ───────────────────────────── */
  $$('.nav-item').forEach(item => {
    const drop = item.querySelector('.nav-drop');
    if (!drop) return;
    let timer = null;

    const openDrop = () => {
      clearTimeout(timer);
      drop.classList.add('open');
      item.classList.add('drop-open');
    };
    const closeDrop = (delay = 100) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        drop.classList.remove('open');
        item.classList.remove('drop-open');
      }, delay);
    };

    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('mouseenter', openDrop);
      link.addEventListener('mouseleave', () => closeDrop(120));
      // Toggle on click for touch devices
      link.addEventListener('click', e => {
        if (isMob()) return; // Mobile uses separate menu
        if (drop.classList.contains('open')) {
          closeDrop(0);
        } else {
          e.preventDefault();
          openDrop();
        }
      });
    }
    drop.addEventListener('mouseenter', () => clearTimeout(timer));
    drop.addEventListener('mouseleave', () => closeDrop(80));
    drop.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', () => clearTimeout(timer));
      a.addEventListener('mouseleave', () => closeDrop(80));
    });
  });

  /* ─── Scroll Reveal ────────────────────────────────────── */
  const revObs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
  );
  $$('.rev').forEach(el => revObs.observe(el));

  /* ─── Hero Line Reveal (index.html) ────────────────────── */
  const heroFoot = $('#heroFoot');
  if (heroFoot) {
    setTimeout(() => {
      $$('.clp').forEach((el, i) =>
        setTimeout(() => el.classList.add('vis'), 200 + i * 140)
      );
      setTimeout(() => heroFoot.classList.add('vis'), 860);
    }, 60);
  }

  /* Page Hero lines (sub-pages) */
  setTimeout(() => {
    const bc = document.getElementById('pgBc') || $('.pg-breadcrumb');
    if (bc) bc.classList.add('vis');
    $$('.pg-h1 .line, .aline, [id^="al"]').forEach((el, i) =>
      setTimeout(() => el.classList.add('vis'), 120 + i * 110)
    );
    const pgFoot = document.getElementById('abFoot') || $('.pg-hero-foot');
    if (pgFoot) setTimeout(() => pgFoot.classList.add('vis'), 560);
  }, 80);

  /* ─── Counter Animation ────────────────────────────────── */
  function animateCounter(el) {
    const raw = el.getAttribute('data-target') || el.getAttribute('data-count') || el.textContent;
    const target = parseFloat(raw);
    const isDecimal = el.hasAttribute('data-decimal');
    const duration = 1400;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = target * ease;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    };
    requestAnimationFrame(tick);
  }

  const cntObs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animateCounter(e.target);
        cntObs.unobserve(e.target);
      });
    },
    { threshold: 0.5 }
  );
  $$('[data-target], [data-count]').forEach(el => cntObs.observe(el));

  /* ─── Smooth Anchor Scrolling ──────────────────────────── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── Back to Top ──────────────────────────────────────── */
  // Inject back-to-top button if not present
  if (!$('#backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.style.cssText = `
      position:fixed;bottom:28px;right:24px;z-index:800;
      width:44px;height:44px;border-radius:50%;border:1px solid rgba(14,13,11,.14);
      background:rgba(244,241,236,.92);backdrop-filter:blur(12px);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;opacity:0;pointer-events:none;
      transition:opacity .3s,transform .3s;transform:translateY(8px);
      font-family:inherit;
    `;
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 600;
      btn.style.opacity = show ? '1' : '0';
      btn.style.pointerEvents = show ? 'auto' : 'none';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
    }, { passive: true });
  }

  /* ─── Toast Notification System ───────────────────────── */
  window.showToast = (msg, type = 'success', duration = 3800) => {
    let wrap = $('#toastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toastWrap';
      wrap.style.cssText = `
        position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
        z-index:9000;display:flex;flex-direction:column;gap:8px;align-items:center;
        pointer-events:none;
      `;
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    const colors = { success: '#22c55e', error: '#ef4444', info: 'var(--ember,#d44c27)' };
    t.style.cssText = `
      padding:.65rem 1.4rem;border-radius:100px;
      background:var(--ink,#0e0d0b);color:var(--bone,#f4f1ec);
      font-family:'Syne',sans-serif;font-size:.72rem;font-weight:600;
      letter-spacing:.06em;border-left:3px solid ${colors[type] || colors.info};
      box-shadow:0 8px 28px rgba(0,0,0,.22);
      opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;
      pointer-events:none;white-space:nowrap;
    `;
    t.textContent = msg;
    wrap.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 320);
    }, duration);
  };

  /* ─── Form: Generic Email Validation ──────────────────── */
  window.validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /* ─── Expose close utilities globally ──────────────────── */
  window.closeMenu = closeMenu;

})();
