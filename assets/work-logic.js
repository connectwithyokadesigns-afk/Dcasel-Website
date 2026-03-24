/*!
 * Dcasel Work Page — Full Logic
 * Filter, view toggle, load more, spotlight, carousels, nav, toasts.
 */
(function () {
'use strict';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ─── Scroll Progress ───────────────────────────────── */
const prog = $('#prog');
window.addEventListener('scroll', () => {
  if (!prog) return;
  const max = document.body.scrollHeight - window.innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}, { passive: true });

/* ─── Sticky Nav ───────────────────────────────────── */
const nav = $('#nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('stuck', window.scrollY > 30);
}, { passive: true });

/* ─── Hamburger ────────────────────────────────────── */
const ham = $('#hamBtn'), menu = $('#mobMenu');
let mobOpen = false;
function openMob() {
  mobOpen = true;
  ham?.classList.add('open'); menu?.classList.add('open');
  ham?.setAttribute('aria-expanded', 'true');
  menu?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMob() {
  mobOpen = false;
  ham?.classList.remove('open'); menu?.classList.remove('open');
  ham?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
ham?.addEventListener('click', () => mobOpen ? closeMob() : openMob());
$$('.mm').forEach(a => a.addEventListener('click', closeMob));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });

/* ─── Dropdowns ────────────────────────────────────── */
$$('.nav-item').forEach(item => {
  const drop = item.querySelector('.nav-drop');
  if (!drop) return;
  let t = null;
  const open = () => { clearTimeout(t); drop.classList.add('open'); item.classList.add('drop-open'); };
  const close = (d = 100) => { clearTimeout(t); t = setTimeout(() => { drop.classList.remove('open'); item.classList.remove('drop-open'); }, d); };
  const link = item.querySelector('.nav-link');
  if (link) { link.addEventListener('mouseenter', open); link.addEventListener('mouseleave', () => close(120)); }
  drop.addEventListener('mouseenter', () => clearTimeout(t));
  drop.addEventListener('mouseleave', () => close(80));
  drop.querySelectorAll('a').forEach(a => {
    a.addEventListener('mouseenter', () => clearTimeout(t));
    a.addEventListener('mouseleave', () => close(80));
  });
});

/* ─── Scroll Reveal ─────────────────────────────────── */
const revObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
  }),
  { threshold: 0.08 }
);
$$('.rev').forEach(el => revObs.observe(el));

/* ─── Layout Sync: Desktop vs Mobile bar ──────────── */
const yearsD = $('#yearsDesktop'), resultD = $('#resultDesktop'), mobRow = $('#wkBarMobRow');
function syncLayout() {
  const mob = window.innerWidth < 768;
  if (yearsD)  yearsD.style.display  = mob ? 'none' : 'flex';
  if (resultD) resultD.style.display = mob ? 'none' : 'flex';
  if (mobRow)  mobRow.style.display  = mob ? 'flex' : 'none';
}
syncLayout();
window.addEventListener('resize', syncLayout, { passive: true });

/* ─── Work Filter + Load More ─────────────────────── */
const grid   = $('#wkGrid');
const empty  = $('#wkEmpty');
const loadWrap = $('#wkLoadWrap');
const loadBtn  = $('#wkLoadBtn');
const loadFill = $('#wkLoadFill');
const loadProg = $('#wkLoadProg');
const resultN    = $('#resultN');
const resultNMob = $('#resultNMob');

const INITIAL = 8;
let activeCat = 'all', activeYear = 'all', moreLoaded = false;

// Initially hide load-more cards
$$('.load-more-card').forEach(c => (c.style.display = 'none'));

function allCards() {
  return $$('.wk-card:not(#wkEmpty)', grid);
}

function render() {
  const all = allCards();
  const visible = all.filter(c => {
    const catOk  = activeCat  === 'all' || c.dataset.cat  === activeCat;
    const yearOk = activeYear === 'all' || c.dataset.year === activeYear;
    return catOk && yearOk;
  });

  const limit = moreLoaded ? visible.length : INITIAL;

  // Show/hide with fade
  all.forEach(c => {
    const show = visible.includes(c) && visible.indexOf(c) < limit;
    if (show) {
      c.style.display = '';
      // Small stagger animation
      const idx = visible.indexOf(c);
      c.style.opacity = '0';
      c.style.transform = 'translateY(16px)';
      setTimeout(() => {
        c.style.transition = 'opacity .4s ease, transform .4s ease';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, Math.min(idx * 40, 320));
    } else {
      c.style.display = 'none';
      c.style.opacity = '';
      c.style.transform = '';
      c.style.transition = '';
    }
  });

  const shown = Math.min(visible.length, limit);
  const total = visible.length;

  if (resultN)    resultN.textContent    = total;
  if (resultNMob) resultNMob.textContent = total;

  // Load More controls
  const hasMore = total > shown;
  if (loadWrap)  loadWrap.style.display  = hasMore ? 'flex' : 'none';
  if (loadFill)  loadFill.style.width    = `${(shown / Math.max(total, 1)) * 100}%`;
  if (loadProg)  loadProg.textContent    = `Showing ${shown} of ${total} project${total !== 1 ? 's' : ''}`;
  if (loadBtn)   loadBtn.disabled        = !hasMore;

  // Empty state
  if (empty) {
    empty.style.display = total === 0 ? 'flex' : 'none';
    if (total === 0) grid.appendChild(empty); // ensure it's in grid
  }

  // Update tab counts
  updateTabCounts();
}

function updateTabCounts() {
  $$('.wk-tab').forEach(tab => {
    const cat = tab.dataset.cat;
    const countEl = tab.querySelector('.wk-tab-count');
    if (!countEl) return;
    const count = allCards().filter(c => {
      const catOk  = cat === 'all' || c.dataset.cat === cat;
      const yearOk = activeYear === 'all' || c.dataset.year === activeYear;
      return catOk && yearOk;
    }).length;
    countEl.textContent = count;
  });
}

render();

/* Tab filtering */
$$('.wk-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.wk-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    moreLoaded = false;
    render();
    // Scroll to grid
    if (grid) {
      const navH = nav ? nav.offsetHeight : 60;
      const top = grid.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* Year filtering — syncs all groups (desktop + mobile) */
$$('.wk-year').forEach(btn => {
  btn.addEventListener('click', () => {
    const yr = btn.dataset.year;
    $$('.wk-year').forEach(b => b.classList.toggle('active', b.dataset.year === yr));
    activeYear = yr;
    moreLoaded = false;
    render();
  });
});

/* Load more */
loadBtn?.addEventListener('click', () => {
  moreLoaded = true;
  render();
  // Smooth scroll to newly revealed cards
  setTimeout(() => {
    const lastVisible = allCards().filter(c => c.style.display !== 'none').pop();
    lastVisible?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 400);
});

/* ─── View Toggle (Grid / List) ───────────────────── */
const vG = $('#vGrid'), vL = $('#vList');
vG?.addEventListener('click', () => {
  grid.classList.remove('view-list');
  vG.classList.add('active');
  vL?.classList.remove('active');
  localStorage.setItem('dcasel-work-view', 'grid');
});
vL?.addEventListener('click', () => {
  grid.classList.add('view-list');
  vL.classList.add('active');
  vG?.classList.remove('active');
  localStorage.setItem('dcasel-work-view', 'list');
});
// Restore saved view preference
const savedView = localStorage.getItem('dcasel-work-view');
if (savedView === 'list') vL?.click();

/* ─── Card Spotlight Effect ─────────────────────────── */
if (window.matchMedia('(pointer:fine)').matches) {
  $$('[data-spot]').forEach(spot => {
    const card = spot.closest('.wk-card');
    if (!card) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
  });
}

/* ─── Card Click → Case Study Page ──────────────────── */
$$('.wk-card[data-cs]').forEach(card => {
  card.addEventListener('click', e => {
    // Don't intercept link clicks
    if (e.target.tagName === 'A') return;
    const slug = card.dataset.cs;
    if (slug) window.location.href = `case-study-post.html?cs=${slug}`;
  });
  // Make it keyboard accessible
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter') card.click();
  });
});

/* ─── Back to Top ────────────────────────────────────── */
(function() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  btn.style.cssText = 'position:fixed;bottom:28px;right:24px;z-index:800;width:42px;height:42px;border-radius:50%;border:1px solid rgba(244,241,236,.14);background:rgba(14,13,11,.85);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;transform:translateY(8px);font-family:inherit;color:rgba(244,241,236,.7);';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
  }, { passive: true });
})();

})();
