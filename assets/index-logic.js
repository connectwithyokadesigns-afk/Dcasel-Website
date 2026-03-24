/*!
 * Dcasel Index — Full Logic
 * Covers: nav, hero, services accordion, carousels, counters,
 *         review form, case study overlay, lightbox, geo canvas,
 *         magnetic buttons, spotlight, keyboard navigation, toasts.
 */
(function () {
'use strict';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const isPtr = window.matchMedia('(pointer:fine)').matches;

/* ─── Scroll Progress Bar ──────────────────────────── */
const prog = $('#prog');
const updateProg = () => {
  if (!prog) return;
  const max = document.body.scrollHeight - window.innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', updateProg, { passive: true });

/* ─── Sticky Nav + Dark-Section Detection ──────────── */
const nav = document.getElementById('nav');
const DARK_IDS = ['work', 'process', 'why', 'about', 'reviews'];
const updateNav = () => {
  if (!nav) return;
  const stuck = window.scrollY > 30;
  nav.classList.toggle('stuck', stuck);
  const navH = nav.offsetHeight;
  const isDark = DARK_IDS.some(id => {
    const el = document.getElementById(id);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < navH && r.bottom > 0;
  });
  nav.classList.toggle('dnav', isDark);
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

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

/* ─── Desktop Dropdown Menus ────────────────────────── */
$$('.nav-item').forEach(item => {
  const drop = item.querySelector('.nav-drop');
  if (!drop) return;
  let t = null;
  const open = () => { clearTimeout(t); drop.classList.add('open'); item.classList.add('drop-open'); };
  const close = (d = 100) => { clearTimeout(t); t = setTimeout(() => { drop.classList.remove('open'); item.classList.remove('drop-open'); }, d); };
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

/* ─── Keyboard: Escape closes everything ────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMob();
    if (typeof closeCS === 'function') closeCS();
    if (typeof closeLB === 'function') closeLB();
    $$('.nav-drop.open').forEach(d => {
      d.classList.remove('open');
      d.closest('.nav-item')?.classList.remove('drop-open');
    });
  }
});

/* ─── Smooth Scroll for # anchors ──────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    closeMob();
    const navH = nav ? nav.offsetHeight : 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Hero Reveal Animation ─────────────────────────── */
setTimeout(() => {
  $$('.clp').forEach((el, i) => setTimeout(() => el.classList.add('vis'), 200 + i * 140));
  setTimeout(() => document.getElementById('heroFoot')?.classList.add('vis'), 860);
}, 60);

/* ─── Scroll Reveal Observer ─────────────────────────── */
const revObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
  }),
  { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
);
$$('.rev').forEach(el => revObs.observe(el));

/* ─── Counter Animation (smooth ease-out) ────────────── */
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
    const tgt = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-count') || 0);
    const isDecimal = el.hasAttribute('data-decimal');
    animateCount(el, tgt, isDecimal);
    cntObs.unobserve(el);
  }),
  { threshold: 0.5 }
);
$$('[data-target],[data-count],.nc-num').forEach(el => cntObs.observe(el));

/* ─── Spotlight Effect on CS Cards ──────────────────── */
$$('.cs-card, .panel-wk-card').forEach(card => {
  const spot = card.querySelector('[data-spot]');
  if (!spot) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });
});

/* ─── Carousel Factory ───────────────────────────────── */
function makeCarousel({ trackId, dotsId, prevId, nextId, counterId, getPerView }) {
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const countEl = counterId ? document.getElementById(counterId) : null;
  if (!track || !prevBtn || !nextBtn) return null;

  const cards = [...track.children].filter(c => c.nodeType === 1);
  const total = cards.length;
  let cur = 0;
  let autoTimer = null;

  const isWorkDots = dotsId === 'wDots';
  const maxIdx = () => Math.max(0, total - getPerView(window.innerWidth));

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const max = maxIdx();
    for (let i = 0; i <= max; i++) {
      const d = document.createElement('button');
      d.className = (isWorkDots ? 'w-dot' : 'r-dot') + (i === cur ? ' on' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    const max = maxIdx();
    cur = Math.max(0, Math.min(idx, max));
    // Calculate card width dynamically — handles resize correctly
    const card = cards[0];
    const gap = 14;
    const cw = card.getBoundingClientRect().width || card.offsetWidth;
    track.style.transform = `translateX(-${cur * (cw + gap)}px)`;
    dotsWrap?.querySelectorAll('button').forEach((d, i) => d.classList.toggle('on', i === cur));
    if (countEl) countEl.textContent = cur + 1;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur >= max;
  }

  prevBtn.addEventListener('click', () => goTo(cur - 1));
  nextBtn.addEventListener('click', () => goTo(cur + 1));

  // Touch / swipe support
  let tsX = 0, tsY = 0, swiping = false;
  track.addEventListener('touchstart', e => {
    tsX = e.touches[0].clientX;
    tsY = e.touches[0].clientY;
    swiping = true;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    if (!swiping) return;
    const dx = Math.abs(e.touches[0].clientX - tsX);
    const dy = Math.abs(e.touches[0].clientY - tsY);
    if (dx > dy && dx > 10) e.preventDefault();
  }, { passive: false });
  track.addEventListener('touchend', e => {
    if (!swiping) return;
    const dx = tsX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 44) (dx > 0 ? goTo(cur + 1) : goTo(cur - 1));
    swiping = false;
  }, { passive: true });

  // Keyboard support when focused
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(cur - 1);
    if (e.key === 'ArrowRight') goTo(cur + 1);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(cur); }, 120);
  });

  buildDots();
  goTo(0);
  return { goTo, getCur: () => cur, getMax: maxIdx };
}

const workCarousel = makeCarousel({
  trackId: 'workTrack', dotsId: 'wDots', prevId: 'wPrev',
  nextId: 'wNext', counterId: 'wCur',
  getPerView: w => w >= 1024 ? 3 : w >= 640 ? 2 : 1,
});

const revCarousel = makeCarousel({
  trackId: 'revTrack', dotsId: 'rDots', prevId: 'rPrev',
  nextId: 'rNext', counterId: null,
  getPerView: w => w >= 1060 ? 3 : w >= 600 ? 2 : 1,
});

// Auto-advance reviews carousel
(function autoReview() {
  let t;
  const next = document.getElementById('rNext');
  const prev = document.getElementById('rPrev');
  function reset() {
    clearInterval(t);
    t = setInterval(() => {
      if (!document.hidden && next) next.click();
    }, 5200);
  }
  reset();
  prev?.addEventListener('click', reset);
  next?.addEventListener('click', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(t); else reset();
  });
})();

/* ─── Magnetic Buttons (desktop only) ───────────────── */
if (isPtr && window.innerWidth >= 900) {
  $$('.btn-p, .nav-cta, .work-more a').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.32;
      const y = (e.clientY - r.top - r.height / 2) * 0.32;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
  });
}

/* ─── Services Accordion ─────────────────────────────── */
$$('.srv-row-head').forEach(head => {
  head.addEventListener('click', () => {
    const row = head.closest('.srv-row');
    const panel = row.querySelector('.srv-panel');
    const inner = panel.querySelector('.srv-panel-inner');
    const isOpen = row.classList.contains('active');

    // Close all open
    $$('.srv-row.active').forEach(r => {
      r.classList.remove('active');
      const p = r.querySelector('.srv-panel');
      // Animate close: set explicit height first then 0
      p.style.height = p.scrollHeight + 'px';
      requestAnimationFrame(() => { p.style.height = '0'; });
    });

    if (!isOpen) {
      row.classList.add('active');
      // Animate open
      const h = inner.getBoundingClientRect().height || inner.scrollHeight;
      panel.style.height = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        panel.style.height = h + 'px';
        setTimeout(() => {
          if (row.classList.contains('active')) {
            // Allow natural height after animation settles
            panel.style.height = 'auto';
          }
          // Scroll into view gently
          const navH = nav ? nav.offsetHeight : 68;
          const rowTop = row.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top: rowTop, behavior: 'smooth' });
        }, 680);
      }));
    }
  });
});

// Recompute panel height on resize
window.addEventListener('resize', () => {
  $$('.srv-row.active').forEach(row => {
    const p = row.querySelector('.srv-panel');
    const i = p.querySelector('.srv-panel-inner');
    p.style.height = 'auto';
    const h = i.getBoundingClientRect().height;
    p.style.height = h + 'px';
  });
});

/* ─── Anchor to specific service row ──────────────────── */
$$('a[href^="#srv-"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    closeMob();
    const navH = nav ? nav.offsetHeight : 68;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => {
      if (!el.classList.contains('active')) {
        el.querySelector('.srv-row-head')?.click();
      }
    }, 500);
  });
});

/* ─── Review Form Fold ───────────────────────────────── */
const rfmTrigger = document.getElementById('rfmTrigger');
const rfmFold = document.getElementById('rfmFold');

if (rfmTrigger && rfmFold) {
  const rfmFI = rfmFold.querySelector('.rfm-fold-inner');
  let rfmOpen = false;

  const ICON_CLOSE = `<svg viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="width:11px;height:11px;stroke:var(--bone)"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>`;
  const ICON_DOWN = `<svg viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="width:11px;height:11px;stroke:var(--bone)"><path d="M12 5v14M5 12l7 7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function openRFM() {
    rfmOpen = true;
    rfmTrigger.innerHTML = 'Close ' + ICON_CLOSE;
    rfmTrigger.setAttribute('aria-expanded', 'true');
    rfmFold.style.height = '0';
    const h = rfmFI.scrollHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      rfmFold.style.height = h + 'px';
      setTimeout(() => {
        rfmFold.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 420);
    }));
  }

  function closeRFM() {
    rfmOpen = false;
    rfmTrigger.innerHTML = 'Write a Review ' + ICON_DOWN;
    rfmTrigger.setAttribute('aria-expanded', 'false');
    rfmFold.style.height = '0';
  }

  rfmTrigger.addEventListener('click', () => (rfmOpen ? closeRFM() : openRFM()));

  window.addEventListener('resize', () => {
    if (rfmOpen) {
      rfmFold.style.height = 'auto';
      rfmFold.style.height = rfmFI.scrollHeight + 'px';
    }
  });

  // Star rating interactive
  const rfmStars = document.getElementById('rfmStars');
  if (rfmStars) {
    const starBtns = $$('.rfm-star-btn', rfmStars);
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-val'));
        rfmStars.setAttribute('data-rating', val);
        starBtns.forEach((b, i) => b.classList.toggle('active', i < val));
      });
      btn.addEventListener('mouseenter', () => {
        const v = parseInt(btn.getAttribute('data-val'));
        starBtns.forEach((b, i) => (b.style.color = i < v ? 'var(--ember)' : ''));
      });
      btn.addEventListener('mouseleave', () => {
        const c = parseInt(rfmStars.getAttribute('data-rating') || 0);
        starBtns.forEach((b, i) => { b.style.color = ''; b.classList.toggle('active', i < c); });
      });
    });
  }

  // Form submission with validation
  document.getElementById('rfmSubmit')?.addEventListener('click', () => {
    const name = $('#rfmName');
    const review = $('#rfmReview');
    const email = $('#rfmEmail');
    let valid = true;

    function markInvalid(el) {
      el.style.borderColor = 'var(--ember)';
      el.focus();
      setTimeout(() => (el.style.borderColor = ''), 1800);
      valid = false;
    }

    const nm = name?.value.trim();
    const rv = review?.value.trim();
    const em = email?.value.trim();
    const rating = parseInt(rfmStars?.getAttribute('data-rating') || 0);

    if (!nm) markInvalid(name);
    else if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) markInvalid(email);
    else if (rv.length < 20) {
      markInvalid(review);
      valid = false;
    }
    if (!valid) return;

    // Show success
    const wrap = document.getElementById('rfmFormWrap');
    const success = document.getElementById('rfmSuccess');
    if (wrap) wrap.style.display = 'none';
    if (success) success.classList.add('show');
    rfmFold.style.height = 'auto';
    rfmFold.style.height = rfmFI.scrollHeight + 'px';

    // Show toast
    if (window.showToast) window.showToast('Review submitted — thank you! 🙏', 'success');
  });
}

/* ─── Back to Top Button ────────────────────────────── */
(function () {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  btn.style.cssText = [
    'position:fixed;bottom:28px;right:24px;z-index:800',
    'width:42px;height:42px;border-radius:50%',
    'border:1px solid rgba(14,13,11,.14)',
    'background:rgba(244,241,236,.92);backdrop-filter:blur(12px)',
    'display:flex;align-items:center;justify-content:center',
    'cursor:pointer;opacity:0;pointer-events:none',
    'transition:opacity .3s,transform .3s;transform:translateY(8px)',
    'font-family:inherit;color:var(--ink,#0e0d0b)',
  ].join(';');
  document.body.appendChild(btn);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
  }, { passive: true });
})();

/* ─── Toast System ──────────────────────────────────── */
window.showToast = (msg, type = 'success', duration = 3800) => {
  let wrap = $('#toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9000;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  const colors = { success: '#22c55e', error: '#ef4444', info: 'var(--ember,#d44c27)' };
  t.style.cssText = [
    'padding:.65rem 1.4rem;border-radius:100px',
    'background:var(--ink,#0e0d0b);color:var(--bone,#f4f1ec)',
    "font-family:'Syne',sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.06em",
    `border-left:3px solid ${colors[type] || colors.info}`,
    'box-shadow:0 8px 28px rgba(0,0,0,.22)',
    'opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s',
    'pointer-events:none;white-space:nowrap',
  ].join(';');
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 320);
  }, duration);
};


/* ─── CS Overlay + Lightbox → handled by assets/cs-overlay.js ─── */

/* ─── Geometric Hero Canvas ──────────────────────────── */
(function geo() {
  const canvas = document.getElementById('geoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, t = 0, mx = 0, my = 0;
  let animId;

  function resize() {
    const p = canvas.parentElement;
    W = canvas.width = p.clientWidth;
    H = canvas.height = p.clientHeight;
    cx = W / 2; cy = H / 2;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left - W / 2) / W;
    my = (e.clientY - r.top - H / 2) / H;
  });

  const ink = 'rgba(14,13,11,', ember = 'rgba(212,76,39,', parchm = 'rgba(217,212,201,';
  const phi = (1 + Math.sqrt(5)) / 2;
  const iv = [[0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],[1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],[phi,0,1],[phi,0,-1],[-phi,0,1],[-phi,0,-1]].map(v => {
    const l = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
    return v.map(x => x / l * 120);
  });
  const ie = [];
  for (let i = 0; i < iv.length; i++) {
    for (let j = i + 1; j < iv.length; j++) {
      const d = Math.sqrt(iv[i].reduce((s, v, k) => s + (v - iv[j][k]) ** 2, 0));
      if (d < 155) ie.push([i, j]);
    }
  }
  const pts = Array.from({ length: 28 }, () => ({
    x: (Math.random() - .5) * 300, y: (Math.random() - .5) * 300, z: (Math.random() - .5) * 200,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, vz: (Math.random() - .5) * .3,
    r: Math.random() * 2 + .5, ph: Math.random() * Math.PI * 2, tp: Math.floor(Math.random() * 3)
  }));
  const rings = [
    { r: 160, tl: .45, sp: .0008, ph: 0, c: ink, a: .07 },
    { r: 200, tl: -.3, sp: .0005, ph: Math.PI / 3, c: parchm, a: .05 },
    { r: 110, tl: .7, sp: .0013, ph: Math.PI, c: ember, a: .1 }
  ];
  const tris = Array.from({ length: 6 }, () => ({
    x: (Math.random() - .5) * 160, y: (Math.random() - .5) * 160, z: (Math.random() - .5) * 80,
    s: 18 + Math.random() * 28, r: Math.random() * Math.PI * 2, rv: (Math.random() - .5) * .006,
    ph: Math.random() * Math.PI * 2, a: .03 + Math.random() * .06
  }));

  function draw() {
    if (document.hidden) { animId = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    const gX = t * .0003 + mx * .2, gY = t * .0003 * .7 + my * .15, fov = 400;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * .45);
    g.addColorStop(0, 'rgba(212,76,39,0.025)'); g.addColorStop(1, 'rgba(14,13,11,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    rings.forEach(ring => {
      const ang = ring.ph + t * ring.sp;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang * .5); ctx.scale(1, Math.sin(ring.tl));
      ctx.beginPath(); ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `${ring.c}${ring.a})`; ctx.lineWidth = .8; ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + ang;
        ctx.beginPath(); ctx.arc(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `${ring.c}${ring.a + .03})`; ctx.fill();
      }
      ctx.restore();
    });

    const cX = Math.cos(gX), sX = Math.sin(gX), cY = Math.cos(gY), sY = Math.sin(gY);
    const proj = iv.map(v => {
      let [x, y, z] = v;
      let x2 = x * cY + z * sY, z2 = -x * sY + z * cY; x = x2; z = z2;
      let y2 = y * cX - z * sX, z3 = y * sX + z * cX; y = y2; z = z3;
      const sc = fov / (fov + z + 300);
      return { px: cx + x * sc, py: cy + y * sc, z, sc };
    });

    ctx.lineWidth = .7;
    [...ie].sort((a, b) => (proj[a[0]].z + proj[a[1]].z) / 2 - (proj[b[0]].z + proj[b[1]].z) / 2).forEach(([i, j]) => {
      const a = proj[i], b = proj[j];
      const d = ((a.z + b.z) / 2 + 200) / 400;
      const al = Math.max(.04, Math.min(.18, d * .16));
      ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
      ctx.strokeStyle = `${ink}${al})`; ctx.stroke();
    });

    proj.forEach(p => {
      const d = (p.z + 200) / 400;
      ctx.beginPath(); ctx.arc(p.px, p.py, 1.8 * p.sc, 0, Math.PI * 2);
      ctx.fillStyle = `${ink}${Math.max(.06, Math.min(.28, d * .25))})`; ctx.fill();
    });

    tris.forEach(tri => {
      tri.r += tri.rv;
      const yo = Math.sin(t * .001 + tri.ph) * 8;
      const cx2 = Math.cos(gX * .4), sx2 = Math.sin(gX * .4);
      let y = tri.y * cx2 - tri.z * sx2 + yo, z = tri.y * sx2 + tri.z * cx2;
      const cy2 = Math.cos(gY * .4), sy2 = Math.sin(gY * .4);
      let x = tri.x * cy2 + z * sy2; z = -tri.x * sy2 + z * cy2;
      const sc = fov / (fov + z + 300);
      ctx.save(); ctx.translate(cx + x * sc, cy + y * sc); ctx.rotate(tri.r);
      ctx.beginPath(); ctx.moveTo(0, -tri.s * sc);
      ctx.lineTo(tri.s * .86 * sc, tri.s * .5 * sc);
      ctx.lineTo(-tri.s * .86 * sc, tri.s * .5 * sc);
      ctx.closePath();
      ctx.strokeStyle = `${ember}${tri.a * sc * 1.5})`; ctx.lineWidth = .6; ctx.stroke();
      ctx.restore();
    });

    ctx.save(); ctx.translate(cx, cy);
    pts.forEach(p => {
      p.x += p.vx + mx * .8; p.y += p.vy + my * .8; p.z += p.vz;
      const hw = W * .6, hh = H * .6, hz = 150;
      if (p.x > hw) p.x -= hw * 2; if (p.x < -hw) p.x += hw * 2;
      if (p.y > hh) p.y -= hh * 2; if (p.y < -hh) p.y += hh * 2;
      if (p.z > hz) p.z -= hz * 2; if (p.z < -hz) p.z += hz * 2;
      const cx3 = Math.cos(gX * .3), sx3 = Math.sin(gX * .3);
      let y = p.y * cx3 - p.z * sx3, z = p.y * sx3 + p.z * cx3;
      const sc = fov / (fov + z + 300);
      const al = Math.max(.04, Math.min(.35, (z + 150) / 300 * .3 + .05));
      const col = Math.random() > .85 ? ember : parchm;
      const r = p.r * sc;
      if (p.tp === 0) {
        ctx.beginPath(); ctx.arc(p.x * sc, y * sc, r, 0, Math.PI * 2);
        ctx.fillStyle = `${col}${al})`; ctx.fill();
      } else if (p.tp === 1) {
        ctx.save(); ctx.translate(p.x * sc, y * sc);
        const s = r * 2.5;
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
        ctx.strokeStyle = `${col}${al * .8})`; ctx.lineWidth = .5; ctx.stroke(); ctx.restore();
      } else {
        ctx.save(); ctx.translate(p.x * sc, y * sc); ctx.rotate(Math.PI / 4);
        const s = r * 2;
        ctx.beginPath(); ctx.rect(-s / 2, -s / 2, s, s);
        ctx.strokeStyle = `${col}${al * .7})`; ctx.lineWidth = .5; ctx.stroke(); ctx.restore();
      }
    });
    ctx.restore();

    ctx.save(); ctx.translate(cx, cy);
    const pA = 0.03 + Math.sin(t * .0025) * .015;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
    ctx.moveTo(0, -12); ctx.lineTo(0, 12);
    ctx.strokeStyle = `${ink}${pA})`; ctx.lineWidth = .8; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.strokeStyle = `${ember}${pA * 1.5})`; ctx.lineWidth = .6; ctx.stroke();
    ctx.restore();

    t++;
    animId = requestAnimationFrame(draw);
  }
  draw();

  // Pause when tab is hidden for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animId); }
    else { t = 0; animId = requestAnimationFrame(draw); }
  });
})();

})();
