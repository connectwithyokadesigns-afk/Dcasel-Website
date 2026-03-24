/*!
 * Dcasel — Shared Subpage Logic
 * Covers: nav, mobile menu, dropdowns, scroll reveal, hero reveal,
 *         progress bar, counters, FAQ accordion, back-to-top, smooth scroll,
 *         keyboard navigation, active nav links, comparison tables, sticky TOC.
 */
(function () {
'use strict';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ─── Scroll Progress Bar ──────────────────────────── */
const prog = $('#prog');
window.addEventListener('scroll', () => {
  if (!prog) return;
  const max = document.body.scrollHeight - window.innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}, { passive: true });

/* ─── Sticky Nav ───────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('stuck', window.scrollY > 30);
}, { passive: true });

/* ─── Hamburger / Mobile Menu ──────────────────────── */
const hamBtn = document.getElementById('hamBtn');
const mobMenu = document.getElementById('mobMenu');
let mobOpen = false;

function openMob() {
  mobOpen = true;
  hamBtn?.classList.add('open');
  mobMenu?.classList.add('open');
  hamBtn?.setAttribute('aria-expanded', 'true');
  mobMenu?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMob() {
  mobOpen = false;
  hamBtn?.classList.remove('open');
  mobMenu?.classList.remove('open');
  hamBtn?.setAttribute('aria-expanded', 'false');
  mobMenu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamBtn?.addEventListener('click', () => (mobOpen ? closeMob() : openMob()));
$$('.mm').forEach(a => a.addEventListener('click', closeMob));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMob();
    $$('.nav-drop.open').forEach(d => {
      d.classList.remove('open');
      d.closest('.nav-item')?.classList.remove('drop-open');
    });
  }
});

/* ─── Desktop Dropdown Menus ────────────────────────── */
$$('.nav-item').forEach(item => {
  const drop = item.querySelector('.nav-drop');
  if (!drop) return;
  let t = null;
  const open = () => { clearTimeout(t); drop.classList.add('open'); item.classList.add('drop-open'); };
  const close = (d = 100) => {
    clearTimeout(t);
    t = setTimeout(() => { drop.classList.remove('open'); item.classList.remove('drop-open'); }, d);
  };
  const link = item.querySelector('.nav-link');
  if (link) {
    link.addEventListener('mouseenter', open);
    link.addEventListener('mouseleave', () => close(120));
  }
  drop.addEventListener('mouseenter', () => clearTimeout(t));
  drop.addEventListener('mouseleave', () => close(80));
  drop.querySelectorAll('a').forEach(a => {
    a.addEventListener('mouseenter', () => clearTimeout(t));
    a.addEventListener('mouseleave', () => close(80));
  });
});

/* ─── Active Nav Link for Current Page ──────────────── */
const currentPage = location.pathname.split('/').pop() || 'index.html';
$$('.nav-drop a, .studio-chip, .srv-chip').forEach(a => {
  try {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && href === currentPage) a.classList.add('active');
  } catch (_) {}
});

/* ─── Smooth Anchor Scroll ──────────────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeMob();
    const navH = nav ? nav.offsetHeight : 68;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
  });
});

/* ─── Hero Reveal (page-specific IDs) ──────────────── */
setTimeout(() => {
  // Common breadcrumb IDs
  ['pgBc','abBc','procBc','whyBc'].forEach(id => document.getElementById(id)?.classList.add('vis'));

  // Hero headline lines — detect by class
  const lines = $$('.pg-h1 .line, .aline, .ab-h1 .aline');
  lines.forEach((el, i) => setTimeout(() => el.classList.add('vis'), 300 + i * 150));

  // Named hero line IDs (al1–al3, hl1–hl3, pl1–pl3, wl1–wl3)
  const lineIds = ['al1','al2','al3','hl1','hl2','hl3','pl1','pl2','pl3','wl1','wl2','wl3'];
  lineIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.classList.add('vis'), 300 + (i % 3) * 150);
  });

  // Hero footer
  ['pgFoot','abFoot','procFoot','whyFoot'].forEach(id =>
    setTimeout(() => document.getElementById(id)?.classList.add('vis'), 900)
  );
}, 80);

/* ─── Scroll Reveal Observer ─────────────────────────── */
const revObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
  }),
  { threshold: 0.07, rootMargin: '0px 0px -36px 0px' }
);
$$('.rev').forEach(el => revObs.observe(el));

/* ─── Counter Animation ────────────────────────────── */
function animateCount(el, target, isDecimal) {
  const dur = 1400;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const v = target * ease;
    el.textContent = isDecimal ? v.toFixed(1) : Math.round(v);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  };
  requestAnimationFrame(tick);
}

const cntObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const tgt = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-count') || el.textContent || '0');
    if (!isNaN(tgt) && tgt > 0) animateCount(el, tgt, el.hasAttribute('data-decimal'));
    cntObs.unobserve(el);
  }),
  { threshold: 0.5 }
);
$$('[data-target],[data-count]').forEach(el => cntObs.observe(el));

// Also animate static stat numbers (with data-n attribute)
$$('[data-n]').forEach(el => cntObs.observe(el));

/* ─── FAQ / Accordion ────────────────────────────────── */
$$('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q) return;

  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    // Close all
    $$('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      const otherA = other.querySelector('.faq-a');
      if (otherA) { otherA.style.height = '0'; otherA.style.opacity = '0'; }
    });
    if (!wasOpen) {
      item.classList.add('open');
      if (a) {
        a.style.height = a.scrollHeight + 'px';
        a.style.opacity = '1';
      }
    }
  });

  // Keyboard support
  q.setAttribute('tabindex', '0');
  q.setAttribute('role', 'button');
  q.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
  });

  // Set initial state
  if (a) { a.style.height = '0'; a.style.opacity = '0'; a.style.overflow = 'hidden'; a.style.transition = 'height .4s ease, opacity .35s ease'; }
});

/* ─── Approach / Why-Dcasel: Expandable Rows ─────────── */
$$('.approach-row, .why-exp-row, .compare-row').forEach(row => {
  const head = row.querySelector('.ar-head, .wr-head, .cr-head');
  const body = row.querySelector('.ar-body, .wr-body, .cr-body');
  if (!head || !body) return;
  body.style.height = '0';
  body.style.overflow = 'hidden';
  body.style.transition = 'height .4s ease';

  head.addEventListener('click', () => {
    const isOpen = row.classList.contains('open');
    $$('.approach-row.open, .why-exp-row.open, .compare-row.open').forEach(r => {
      r.classList.remove('open');
      const b = r.querySelector('.ar-body, .wr-body, .cr-body');
      if (b) b.style.height = '0';
    });
    if (!isOpen) {
      row.classList.add('open');
      body.style.height = body.scrollHeight + 'px';
    }
  });
});

/* ─── Process Steps: Hover state on touch ─────────────── */
if (window.matchMedia('(hover:none)').matches) {
  $$('.proc-step, .step, .why-row, .del-item').forEach(el => {
    el.addEventListener('touchstart', () => el.classList.add('touch-hover'), { passive: true });
    el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('touch-hover'), 600), { passive: true });
  });
}

/* ─── Sticky TOC (case-study-post.html) ──────────────── */
const tocItems = $$('.toc-nav-item');
if (tocItems.length > 0) {
  const sections = tocItems.map(i => document.getElementById(i.dataset.sec)).filter(Boolean);
  const visMap = new Map();

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => visMap.set(e.target.id, e.intersectionRatio));
    let best = null, bestRatio = -1;
    visMap.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id; } });
    if (best) tocItems.forEach(i => i.classList.toggle('active', i.dataset.sec === best));
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-10% 0px -30% 0px' });

  sections.forEach(s => { visMap.set(s.id, 0); secObs.observe(s); });

  tocItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', e => {
      e.preventDefault();
      const sec = document.getElementById(item.dataset.sec);
      if (!sec) return;
      const navH = nav ? nav.offsetHeight : 68;
      window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
    });
    item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
  });
}

/* ─── Case Study Post: Gallery ────────────────────────── */
(function () {
  const grid = document.getElementById('galGrid');
  if (!grid) return;

  const tabs = $$('.gal-tab');
  const moreBtn = document.getElementById('galMoreBtn');
  const lb      = document.getElementById('galLb');
  const lbImg   = document.getElementById('galLbImg');
  const lbTag   = document.getElementById('galLbTag');
  const lbTitle = document.getElementById('galLbTitle');
  const lbClose = document.getElementById('galLbClose');
  const lbPrev  = document.getElementById('galLbPrev');
  const lbNext  = document.getElementById('galLbNext');
  const lbCntr  = document.getElementById('galLbCounter');

  let items = $$('.gal-item', grid);
  let visibleItems = [...items];
  let currentLbIdx = 0;
  let showingAll = false;
  const INITIAL_SHOW = 6;

  function applyVisibility() {
    visibleItems.forEach((el, i) => {
      const show = showingAll || i < INITIAL_SHOW;
      el.style.display = show ? '' : 'none';
    });
    if (moreBtn) {
      const hidden = showingAll ? 0 : Math.max(0, visibleItems.length - INITIAL_SHOW);
      moreBtn.style.display = hidden > 0 ? 'flex' : 'none';
      if (hidden > 0)
        moreBtn.innerHTML = `Show ${hidden} more <svg viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      items.forEach(el => el.classList.toggle('hidden', f !== 'all' && el.dataset.cat !== f));
      visibleItems = items.filter(el => !el.classList.contains('hidden'));
      showingAll = false;
      applyVisibility();
    });
  });

  moreBtn?.addEventListener('click', () => { showingAll = true; applyVisibility(); });

  function openLb(idx) {
    const visible = showingAll ? visibleItems : visibleItems.slice(0, INITIAL_SHOW);
    currentLbIdx = Math.max(0, Math.min(idx, visible.length - 1));
    const item = visible[currentLbIdx];
    if (!item || !lb) return;
    if (lbImg)   lbImg.src             = item.dataset.src || '';
    if (lbTag)   lbTag.textContent     = item.dataset.tag || '';
    if (lbTitle) lbTitle.textContent   = item.dataset.title || '';
    if (lbCntr)  lbCntr.textContent    = `${currentLbIdx + 1} / ${visible.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function closeLb() {
    lb?.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 350);
  }

  function navLb(dir) {
    const visible = showingAll ? visibleItems : visibleItems.slice(0, INITIAL_SHOW);
    currentLbIdx = (currentLbIdx + dir + visible.length) % visible.length;
    const item = visible[currentLbIdx];
    if (!item) return;
    if (lbImg) { lbImg.style.opacity = '0'; }
    setTimeout(() => {
      if (lbImg)   { lbImg.src = item.dataset.src || ''; lbImg.style.opacity = '1'; }
      if (lbTag)   lbTag.textContent   = item.dataset.tag || '';
      if (lbTitle) lbTitle.textContent = item.dataset.title || '';
      if (lbCntr)  lbCntr.textContent  = `${currentLbIdx + 1} / ${visible.length}`;
    }, 180);
  }

  items.forEach((el, _i) => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    const openThis = () => {
      const visible = showingAll ? visibleItems : visibleItems.slice(0, INITIAL_SHOW);
      const idx = visible.indexOf(el);
      if (idx >= 0) openLb(idx);
    };
    el.addEventListener('click', openThis);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); } });
  });

  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', () => navLb(-1));
  lbNext?.addEventListener('click', () => navLb(1));
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });

  // Hero image load animation
  setTimeout(() => document.getElementById('heroImg')?.classList.add('loaded'), 100);

  applyVisibility();
})();

/* ─── Why-Dcasel: Comparison Table Toggle ───────────────── */
$$('.comp-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const table = document.getElementById(btn.dataset.target);
    if (!table) return;
    const isOpen = table.classList.contains('open');
    table.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.textContent = isOpen ? 'Show comparison' : 'Hide comparison';
  });
});

/* ─── Service Pages: Tab/Section Switcher ───────────────── */
$$('.srv-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    $$('.srv-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('.srv-tab-content').forEach(c => c.classList.toggle('active', c.dataset.tab === target));
  });
});

/* ─── Back to Top ─────────────────────────────────────── */
(function () {
  const isDark = document.body.style.background === 'var(--dark)'
    || document.querySelector('body')?.style.color === 'var(--bone)'
    || !!$('.wk-hero'); // work/service pages are dark

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Detect dark/light background from the page body
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const isDarkPage = bodyBg === 'rgb(20, 18, 16)' || bodyBg === 'rgb(14, 13, 11)' || bodyBg === 'rgb(28, 26, 23)';

  btn.style.cssText = [
    'position:fixed;bottom:28px;right:24px;z-index:800',
    'width:42px;height:42px;border-radius:50%',
    isDarkPage
      ? 'border:1px solid rgba(244,241,236,.12);background:rgba(14,13,11,.85);color:rgba(244,241,236,.7)'
      : 'border:1px solid rgba(14,13,11,.14);background:rgba(244,241,236,.92);color:var(--ink,#0e0d0b)',
    'backdrop-filter:blur(12px)',
    'display:flex;align-items:center;justify-content:center',
    'cursor:pointer;opacity:0;pointer-events:none',
    'transition:opacity .3s,transform .3s;transform:translateY(8px)',
    'font-family:inherit',
  ].join(';');

  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
  }, { passive: true });
})();

/* ─── CTA Form: Contact / Project Enquiry ──────────────── */
(function () {
  const form = document.getElementById('ctaForm') || document.getElementById('contactForm');
  if (!form) return;

  const nameEl    = form.querySelector('[name="name"], #ctaName, #contactName');
  const emailEl   = form.querySelector('[name="email"], #ctaEmail, #contactEmail');
  const msgEl     = form.querySelector('[name="message"], #ctaMsg, #contactMsg');
  const submitEl  = form.querySelector('[type="submit"], .cta-submit, #ctaSubmit');
  const successEl = document.getElementById('ctaSuccess') || document.getElementById('contactSuccess');

  if (!submitEl) return;

  function shake(el) {
    el.style.borderColor = 'var(--ember)';
    el.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 300 });
    setTimeout(() => (el.style.borderColor = ''), 1800);
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  submitEl.addEventListener('click', e => {
    e.preventDefault();
    let valid = true;

    if (nameEl && !nameEl.value.trim()) { shake(nameEl); nameEl.focus(); valid = false; }
    if (valid && emailEl && !isValidEmail(emailEl.value)) { shake(emailEl); emailEl.focus(); valid = false; }
    if (valid && msgEl && msgEl.value.trim().length < 10) { shake(msgEl); msgEl.focus(); valid = false; }

    if (!valid) return;

    // Simulate send
    submitEl.textContent = 'Sending…';
    submitEl.disabled = true;
    setTimeout(() => {
      if (successEl) {
        form.style.display = 'none';
        successEl.style.display = 'block';
      } else {
        submitEl.textContent = '✓ Message sent!';
        setTimeout(() => { submitEl.textContent = 'Send message'; submitEl.disabled = false; }, 3000);
      }
    }, 1000);
  });
})();

/* ─── Mobile: Close menu on outside click ──────────────── */
document.addEventListener('click', e => {
  if (!mobOpen) return;
  if (!mobMenu?.contains(e.target) && e.target !== hamBtn) closeMob();
});

})();
