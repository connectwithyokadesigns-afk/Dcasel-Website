/*!
 * cs-overlay.js — Case Study Overlay + Lightbox
 * Works on index.html and work.html
 * Triggered by any element with data-cs="slug"
 */
(function () {
'use strict';

/* ── Dataset ─────────────────────────────────────────── */
var CS = {
  vertex:{
    cat:'Brand Identity · 2024', title:'Vertex Technologies',
    img:'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=1600&auto=format&fit=crop',
    client:'Vertex Technologies', year:'2024', service:'Brand Identity', duration:'6 Weeks',
    lead:'A complete brand identity overhaul for a B2B SaaS company entering Series B — built to command premium positioning in a crowded enterprise market.',
    tags:['Brand Identity','Logo System','Brand Guidelines','Typography','Colour'],
    desc:'Vertex came to us with a logo from their early days that no longer reflected who they were. We rebuilt the entire brand from the ground up — starting with a 3-week discovery phase that revealed their true differentiator: technical depth with human clarity.',
    metrics:[{n:'3×',l:'Inbound Lead Growth'},{n:'240%',l:'Investor Deck Engagement'},{n:'6wk',l:'Project Duration'}],
    challenge:'The existing brand communicated a scrappy startup, not a scaling enterprise platform. The challenge was to evolve without alienating their existing user base while signalling a step-change in ambition.',
    approach:'We began with a brand positioning workshop. The visual language emerged from this clarity — geometric precision that signals engineering excellence, warm off-white tones that prevent the coldness typical of enterprise SaaS.',
    fullImg:'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cThe new brand didn\u2019t just look better \u2014 it changed how everyone in the room thought about us.\u201d',
    quoteBy:'\u2014 Alex Rao, CEO, Vertex Technologies',
    gallery:['https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop']
  },
  horizon:{
    cat:'Web Platform · 2024', title:'Horizon Inc.',
    img:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop',
    client:'Horizon Inc.', year:'2024', service:'Web Design & Development', duration:'8 Weeks',
    lead:'A full redesign of a fintech platform serving 50,000+ users — transforming a legacy interface into a modern, conversion-optimised experience that increased signups by 240%.',
    tags:['Web Design','UI/UX','React','Webflow','CMS'],
    desc:'Horizon\'s product had grown faster than its design. What began as a clean MVP had accumulated years of feature additions without design governance. We rebuilt the entire front-end experience.',
    metrics:[{n:'240%',l:'Conversion Rate Lift'},{n:'55%',l:'Reduced Churn'},{n:'8wk',l:'Project Duration'}],
    challenge:'The existing interface had 47 distinct page templates with inconsistent patterns. Users were confused by navigation that had grown organically over 4 years.',
    approach:'We started with a 2-week UX audit, interviewing 14 power users and 8 churned customers. We rebuilt the IA around user goals rather than product features.',
    fullImg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cThe redesign paid for itself in the first month. Conversion is up 240%.\u201d',
    quoteBy:'\u2014 Marcus Chen, CTO, Horizon Inc.',
    gallery:['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop']
  },
  nexus:{
    cat:'Product Design · 2023', title:'Nexus App',
    img:'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop',
    client:'Nexus Health', year:'2023', service:'Product Design', duration:'10 Weeks',
    lead:'Mobile-first product redesign for a healthcare startup — reducing patient onboarding from 12 minutes to under 90 seconds without losing a single required data point.',
    tags:['Product Design','UX Research','Mobile','Figma','Healthcare'],
    desc:'Nexus was losing 68% of patients during onboarding. The existing flow was designed for regulatory compliance rather than user comprehension.',
    metrics:[{n:'90sec',l:'New Onboarding Time'},{n:'68%',l:'Reduced Drop-off'},{n:'10wk',l:'Project Duration'}],
    challenge:'Healthcare apps face a unique constraint: regulatory compliance creates mandatory data collection that can feel overwhelming to patients who are already anxious.',
    approach:'Progressive disclosure became our core design principle — breaking the 40-field form into contextual micro-moments across the first week of app use.',
    fullImg:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cDcasel was the first team that actually understood that our users were patients, not power users.\u201d',
    quoteBy:'\u2014 Dr. Priya Subramaniam, Founder, Nexus Health',
    gallery:['https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop']
  },
  prism:{
    cat:'Dashboard UI · 2023', title:'Prism Analytics',
    img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    client:'Prism Analytics', year:'2023', service:'Product Design', duration:'8 Weeks',
    lead:'Enterprise data visualisation dashboard shipped to 12,000 daily users across 140 enterprise accounts.',
    tags:['Dashboard','Data Viz','Product Design','Enterprise','B2B'],
    desc:'Prism had built sophisticated analytics infrastructure, but their dashboard interface was inaccessible to non-technical users.',
    metrics:[{n:'12k',l:'Daily Active Users'},{n:'3.2×',l:'Session Duration'},{n:'55%',l:'Support Ticket Drop'}],
    challenge:'Enterprise analytics dashboards serve two distinct audiences: the data scientist who wants raw control, and the executive who wants a clear story.',
    approach:'We introduced a layered information architecture: a Story View for executives and an Explore View for analysts. Users toggle seamlessly between them.',
    fullImg:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cOur enterprise clients used to request custom reports every week. Now they build their own.\u201d',
    quoteBy:'\u2014 Vikram Patel, Product Lead, Prism Analytics',
    gallery:['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop']
  },
  bloom:{
    cat:'Brand + Web · 2023', title:'Bloom Wellness',
    img:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1600&auto=format&fit=crop',
    client:'Bloom Wellness', year:'2023', service:'Brand Identity + Web Design', duration:'12 Weeks',
    lead:'A complete brand and web overhaul for a D2C wellness company — transforming a generic health brand into a premium lifestyle identity that tripled revenue in 6 months.',
    tags:['Brand Identity','Web Design','D2C','Webflow','Creative Direction'],
    desc:'Bloom was competing on price in a commodity market. Their brand looked like every other green-and-white wellness brand.',
    metrics:[{n:'3×',l:'Revenue in 6 Months'},{n:'4.2×',l:'Avg. Order Value'},{n:'12wk',l:'Project Duration'}],
    challenge:'The wellness category is crowded with green gradients and stock photography. Standing out meant rejecting the entire category visual language.',
    approach:'We positioned Bloom at the intersection of apothecary heritage and contemporary wellness science. The visual language draws from botanical illustration and laboratory precision.',
    fullImg:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cBefore the rebrand, we were apologising for our pricing. After, we were justifying it confidently.\u201d',
    quoteBy:'\u2014 Priya Sharma, Founder, Bloom Wellness',
    gallery:['https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800&auto=format&fit=crop']
  },
  zenith:{
    cat:'UX Design · 2022', title:'Zenith Capital',
    img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    client:'Zenith Capital', year:'2022', service:'UX Design + Brand Identity', duration:'9 Weeks',
    lead:'Wealth management platform UX overhaul — increasing task completion by 65% for a platform managing over \u20b92,400 crore in assets.',
    tags:['UX Design','Fintech','Brand Identity','HNI','Dashboard'],
    desc:'Zenith\'s platform was built by engineers for engineers. HNI clients were calling relationship managers for tasks the platform could theoretically handle.',
    metrics:[{n:'65%',l:'Task Completion Lift'},{n:'82%',l:'Self-Service Rate'},{n:'4.7\u2605',l:'App Store Rating'}],
    challenge:'Wealth management interfaces must balance contradictory demands: project confidence and stability while being genuinely contemporary and usable.',
    approach:'We studied how HNI clients actually described their relationship with money — the language was almost entirely personal and goal-oriented. We rebuilt the IA around life goals.',
    fullImg:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cOur clients used to call us to check their portfolio balance. Now they\u2019re using features nobody had ever touched.\u201d',
    quoteBy:'\u2014 Arjun Mehta, CEO, Zenith Capital',
    gallery:['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop']
  },
  nova:{
    cat:'SaaS Design · 2022', title:'Nova SaaS',
    img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    client:'Nova SaaS', year:'2022', service:'Product Design', duration:'12 Weeks',
    lead:'End-to-end B2B SaaS product design — reducing churn by 40% through a redesign that turned a complex tool into an intuitive daily workflow platform.',
    tags:['SaaS','Product Design','B2B','Design System','Figma'],
    desc:'Nova had product-market fit but a churn problem. Customers were leaving after 90 days not because the product didn\'t work, but because they couldn\'t figure out how to make it work for them.',
    metrics:[{n:'40%',l:'Churn Reduction'},{n:'3.1×',l:'Feature Adoption'},{n:'NPS+42',l:'Net Promoter Score'}],
    challenge:'B2B SaaS churn is almost always a design problem masquerading as a product problem. Nova had built powerful features presented as a library of tools rather than a guided workflow.',
    approach:'We introduced an opinionated onboarding flow that got customers to their first aha moment within 7 minutes of signup, then redesigned around recommended workflows.',
    fullImg:'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1600&auto=format&fit=crop',
    img2a:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=900&auto=format&fit=crop',
    img2b:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
    quote:'\u201cThe churn numbers alone paid for the engagement 10 times over.\u201d',
    quoteBy:'\u2014 Linda Patel, CMO, Nova SaaS',
    gallery:['https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop']
  }
};

/* ── CSS (injected once) ─────────────────────────────── */
if (!document.getElementById('cso-css')) {
  var s = document.createElement('style');
  s.id = 'cso-css';
  s.textContent = [
    '#csOverlay{position:fixed;inset:0;z-index:2000;background:#f4f1ec;overflow-y:auto;opacity:0;pointer-events:none;transition:opacity .5s ease;}',
    '#csOverlay.open{opacity:1;pointer-events:auto;}',
    'body.cs-open{overflow:hidden;}',
    '.cso-bar{position:sticky;top:0;z-index:10;background:rgba(244,241,236,.93);backdrop-filter:blur(20px);border-bottom:1px solid rgba(14,13,11,.07);height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,4vw,64px);}',
    '@media(min-width:768px){.cso-bar{height:68px;}}',
    '.cso-back{display:flex;align-items:center;gap:10px;font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6e6860;background:none;border:none;cursor:pointer;font-family:inherit;min-height:44px;}',
    '.cso-back:hover{color:#0e0d0b;}',
    '.cso-logo{font-family:"Cormorant Garamond",serif;font-size:1.3rem;font-weight:500;letter-spacing:.06em;color:#0e0d0b;}',
    '.cso-logo em{font-style:normal;color:#d44c27;}',
    '.cso-btn{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.38rem 1rem;border-radius:100px;border:1px solid rgba(14,13,11,.2);color:#0e0d0b;background:none;cursor:pointer;font-family:inherit;transition:background .22s,color .22s;}',
    '.cso-btn:hover{background:#0e0d0b;color:#f4f1ec;}',
    '.cso-hero-img{position:relative;height:clamp(300px,54vw,620px);overflow:hidden;background:#141210;}',
    '.cso-hero-img img{width:100%;height:100%;object-fit:cover;filter:brightness(.58);transition:transform 8s ease;}',
    '#csOverlay.open .cso-hero-img img{transform:scale(1.04);}',
    '.cso-hero-over{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,4vw,52px);background:linear-gradient(to top,rgba(14,13,11,.9),rgba(14,13,11,.18) 60%,transparent);}',
    '.cso-eyebrow{font-size:.58rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#d44c27;margin-bottom:12px;}',
    '.cso-h1{font-family:"Cormorant Garamond",serif;font-size:clamp(36px,6.5vw,96px);font-weight:300;color:#f4f1ec;line-height:.88;letter-spacing:-.025em;margin-bottom:20px;}',
    '.cso-meta{display:flex;gap:clamp(16px,2.5vw,32px);flex-wrap:wrap;}',
    '.cso-meta-item{display:flex;flex-direction:column;gap:4px;}',
    '.cso-meta-label{font-size:.5rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,241,236,.35);}',
    '.cso-meta-val{font-size:.78rem;font-weight:600;color:rgba(244,241,236,.7);}',
    '.cso-body{max-width:1200px;margin:0 auto;padding:clamp(40px,6vw,80px) clamp(20px,4vw,80px);}',
    '.cso-intro{display:grid;grid-template-columns:1fr;gap:40px;margin-bottom:clamp(48px,7vw,88px);}',
    '@media(min-width:860px){.cso-intro{grid-template-columns:1fr 1fr;gap:64px;align-items:start;}}',
    '.cso-lead{font-family:"Cormorant Garamond",serif;font-size:clamp(18px,2.6vw,30px);font-weight:400;line-height:1.35;letter-spacing:-.01em;color:#0e0d0b;}',
    '.cso-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}',
    '.cso-tag{font-size:.54rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6e6860;padding:.22rem .75rem;border:1px solid rgba(14,13,11,.14);border-radius:100px;}',
    '.cso-desc-txt{font-size:.84rem;font-weight:500;line-height:1.9;color:#6e6860;}',
    '.cso-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(14,13,11,.08);border:1px solid rgba(14,13,11,.08);margin-bottom:clamp(48px,7vw,88px);}',
    '@media(max-width:520px){.cso-metrics{grid-template-columns:1fr 1fr;}.cso-metric:last-child{grid-column:1/-1;}}',
    '.cso-metric{background:#f4f1ec;padding:clamp(20px,3vw,36px) clamp(16px,2.5vw,32px);}',
    '.cso-metric-n{font-family:"Cormorant Garamond",serif;font-size:clamp(2rem,3.8vw,3.2rem);font-weight:300;color:#d44c27;line-height:1;margin-bottom:6px;}',
    '.cso-metric-l{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6e6860;}',
    '.cso-section{margin-bottom:clamp(48px,7vw,88px);}',
    '.cso-sec-label{font-size:.58rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#6e6860;display:flex;align-items:center;gap:10px;margin-bottom:18px;}',
    '.cso-sec-label::before{content:"";width:18px;height:1px;background:#d9d4c9;}',
    '.cso-sec-title{font-family:"Cormorant Garamond",serif;font-size:clamp(20px,3.2vw,40px);font-weight:400;line-height:.95;letter-spacing:-.015em;margin-bottom:18px;color:#0e0d0b;}',
    '.cso-sec-body{font-size:.85rem;font-weight:500;line-height:1.88;color:#6e6860;max-width:68ch;}',
    '.cso-fullimg{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;margin:clamp(28px,4vw,48px) 0;}',
    '.cso-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:clamp(24px,3.5vw,44px) 0;}',
    '@media(max-width:520px){.cso-2col{grid-template-columns:1fr;}}',
    '.cso-2col img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;}',
    '.cso-quote{padding:clamp(24px,4vw,44px);border-left:3px solid #d44c27;background:#eae6de;margin:clamp(36px,5vw,60px) 0;}',
    '.cso-quote p{font-family:"Cormorant Garamond",serif;font-size:clamp(1rem,1.9vw,1.4rem);font-style:italic;line-height:1.5;color:#0e0d0b;margin-bottom:10px;}',
    '.cso-quote cite{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#d44c27;}',
    '.cso-gallery-wrap{margin-bottom:clamp(48px,7vw,88px);}',
    '.cso-gallery-head{margin-bottom:22px;}',
    '.cso-gallery-title{font-family:"Cormorant Garamond",serif;font-size:clamp(20px,2.8vw,34px);font-weight:400;line-height:1;color:#0e0d0b;}',
    '.cso-gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}',
    '@media(min-width:600px){.cso-gallery-grid{grid-template-columns:repeat(3,1fr);}}',
    '@media(min-width:1024px){.cso-gallery-grid{grid-template-columns:repeat(4,1fr);}}',
    '.cso-gal-item{position:relative;overflow:hidden;aspect-ratio:1;background:#eae6de;cursor:pointer;}',
    '.cso-gal-item.wide{grid-column:span 2;}',
    '.cso-gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease,filter .4s;}',
    '.cso-gal-item:hover img{transform:scale(1.06);filter:brightness(.82);}',
    '.cso-gal-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(14,13,11,.3);transition:opacity .3s;}',
    '.cso-gal-item:hover .cso-gal-ov{opacity:1;}',
    '.cso-end{padding:clamp(40px,6vw,72px) 0;text-align:center;border-top:1px solid rgba(14,13,11,.08);}',
    '.cso-end h3{font-family:"Cormorant Garamond",serif;font-size:clamp(26px,4.5vw,60px);font-weight:300;letter-spacing:-.02em;margin-bottom:14px;color:#0e0d0b;}',
    '.cso-end h3 em{font-style:italic;color:#d44c27;}',
    '.cso-end p{font-size:.84rem;font-weight:500;color:#6e6860;margin-bottom:28px;}',
    '.cso-end-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}',
    '.cso-p-btn{display:inline-flex;align-items:center;gap:8px;font-family:"Syne",sans-serif;font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#f4f1ec;background:#0e0d0b;padding:.78rem 1.5rem;border-radius:100px;border:none;cursor:pointer;transition:transform .28s,box-shadow .28s;}',
    '.cso-p-btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(14,13,11,.18);}',
    '.cso-o-btn{display:inline-flex;align-items:center;gap:8px;font-family:"Syne",sans-serif;font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0e0d0b;padding:.78rem 1.5rem;border-radius:100px;border:1px solid rgba(14,13,11,.18);cursor:pointer;background:none;transition:background .22s;}',
    '.cso-o-btn:hover{background:#eae6de;}',
    '#galLightbox{position:fixed;inset:0;z-index:3000;background:rgba(14,13,11,.97);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}',
    '#galLightbox.open{opacity:1;pointer-events:auto;}',
    '#galImg{max-width:90vw;max-height:88vh;object-fit:contain;display:block;}',
    '.gal-lb-close{position:absolute;top:20px;right:24px;background:none;border:none;color:rgba(244,241,236,.6);font-size:1.6rem;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:color .2s;}',
    '.gal-lb-close:hover{color:#f4f1ec;}',
    '.gal-lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(244,241,236,.08);border:1px solid rgba(244,241,236,.12);width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .22s;}',
    '.gal-lb-nav:hover{background:#d44c27;border-color:#d44c27;}',
    '#galPrev{left:20px;}#galNext{right:20px;}'
  ].join('');
  document.head.appendChild(s);
}

/* ── Ensure overlay + lightbox HTML ─────────────────── */
if (!document.getElementById('csOverlay')) {
  document.body.insertAdjacentHTML('beforeend',
    '<div id="csOverlay" role="dialog" aria-modal="true" aria-label="Case Study">' +
      '<div class="cso-bar">' +
        '<button class="cso-back" id="csoBack"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>Back to Work</button>' +
        '<span class="cso-logo">DC<em>.</em>ASEL</span>' +
        '<button class="cso-btn" id="csoStartBtn">Start a Project</button>' +
      '</div>' +
      '<div id="csoContent"></div>' +
    '</div>' +
    '<div id="galLightbox" role="dialog" aria-modal="true">' +
      '<button class="gal-lb-close" id="galClose" aria-label="Close">&#x2715;</button>' +
      '<button class="gal-lb-nav" id="galPrev" aria-label="Previous"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(244,241,236,.7)" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<img id="galImg" src="" alt="">' +
      '<button class="gal-lb-nav" id="galNext" aria-label="Next"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(244,241,236,.7)" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '</div>');
}

/* ── HTML builder ────────────────────────────────────── */
function build(d) {
  var tags = d.tags.map(function(t){return '<span class="cso-tag">'+t+'</span>';}).join('');
  var metrics = d.metrics.map(function(m){return '<div class="cso-metric"><div class="cso-metric-n">'+m.n+'</div><div class="cso-metric-l">'+m.l+'</div></div>';}).join('');
  var gal = d.gallery.map(function(src,i){
    return '<div class="cso-gal-item'+(i===0?' wide':'')+'" data-gi="'+i+'" tabindex="0" role="button">'+
      '<img src="'+src+'" alt="" loading="lazy">'+
      '<div class="cso-gal-ov"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke-linecap="round"/></svg></div>'+
    '</div>';
  }).join('');
  var arrow = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  return (
    '<div class="cso-hero-img"><img src="'+d.img+'" alt="'+d.title+'">'+
    '<div class="cso-hero-over">'+
      '<div class="cso-eyebrow">'+d.cat+'</div>'+
      '<h1 class="cso-h1">'+d.title+'</h1>'+
      '<div class="cso-meta">'+
        '<div class="cso-meta-item"><span class="cso-meta-label">Client</span><span class="cso-meta-val">'+d.client+'</span></div>'+
        '<div class="cso-meta-item"><span class="cso-meta-label">Year</span><span class="cso-meta-val">'+d.year+'</span></div>'+
        '<div class="cso-meta-item"><span class="cso-meta-label">Service</span><span class="cso-meta-val">'+d.service+'</span></div>'+
        '<div class="cso-meta-item"><span class="cso-meta-label">Duration</span><span class="cso-meta-val">'+d.duration+'</span></div>'+
      '</div>'+
    '</div></div>'+
    '<div class="cso-body">'+
      '<div class="cso-intro">'+
        '<p class="cso-lead">'+d.lead+'</p>'+
        '<div><div class="cso-tags">'+tags+'</div><p class="cso-desc-txt">'+d.desc+'</p></div>'+
      '</div>'+
      '<div class="cso-metrics">'+metrics+'</div>'+
      '<div class="cso-section"><div class="cso-sec-label">The Challenge</div><h2 class="cso-sec-title">What we were up against</h2><p class="cso-sec-body">'+d.challenge+'</p><img class="cso-fullimg" src="'+d.fullImg+'" alt="" loading="lazy"></div>'+
      '<div class="cso-section"><div class="cso-sec-label">Our Approach</div><h2 class="cso-sec-title">How we solved it</h2><p class="cso-sec-body">'+d.approach+'</p><div class="cso-2col"><img src="'+d.img2a+'" alt="" loading="lazy"><img src="'+d.img2b+'" alt="" loading="lazy"></div></div>'+
      '<div class="cso-quote"><p>'+d.quote+'</p><cite>'+d.quoteBy+'</cite></div>'+
      '<div class="cso-gallery-wrap"><div class="cso-gallery-head"><h2 class="cso-gallery-title">Project Gallery</h2></div><div class="cso-gallery-grid">'+gal+'</div></div>'+
      '<div class="cso-end"><h3>Ready to build something<br><em>remarkable?</em></h3><p>Tell us about your project. First consultation is always free.</p>'+
        '<div class="cso-end-btns"><button class="cso-p-btn" id="csoEndStart">Start a Project '+arrow+'</button><button class="cso-o-btn" id="csoEndBack">Back to Work</button></div>'+
      '</div>'+
    '</div>'
  );
}

/* ── State ───────────────────────────────────────────── */
var galImages = [], galIdx = 0, savedY = 0;

/* ── Open overlay ────────────────────────────────────── */
function openCS(slug) {
  var d = CS[slug];
  if (!d) return;
  var ov = document.getElementById('csOverlay');
  var cc = document.getElementById('csoContent');
  if (!ov || !cc) return;

  galImages = d.gallery || [];
  galIdx = 0;
  savedY = window.scrollY;

  cc.innerHTML = build(d);
  ov.classList.add('open');
  document.body.classList.add('cs-open');
  ov.scrollTop = 0;

  // Wire gallery items
  cc.querySelectorAll('.cso-gal-item').forEach(function(item) {
    item.addEventListener('click', function() {
      openLB(parseInt(item.getAttribute('data-gi') || '0', 10));
    });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(parseInt(item.getAttribute('data-gi') || '0', 10)); }
    });
  });

  // End buttons
  var es = cc.querySelector('#csoEndStart');
  var eb = cc.querySelector('#csoEndBack');
  if (es) es.addEventListener('click', function() {
    closeCS();
    setTimeout(function() {
      var cta = document.getElementById('cta') || document.querySelector('.wk-cta');
      if (cta) cta.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  });
  if (eb) eb.addEventListener('click', closeCS);

  setTimeout(function() { var b = ov.querySelector('button'); if (b) b.focus(); }, 80);
}

/* ── Close overlay ───────────────────────────────────── */
function closeCS() {
  var ov = document.getElementById('csOverlay');
  var cc = document.getElementById('csoContent');
  if (!ov) return;
  ov.classList.remove('open');
  document.body.classList.remove('cs-open');
  var y = savedY;
  setTimeout(function() {
    if (cc) cc.innerHTML = '';
    window.scrollTo({ top: y, behavior: 'instant' });
  }, 550);
}
window.closeCS = closeCS;

// Static back/start buttons
var backBtn = document.getElementById('csoBack');
var startBtn = document.getElementById('csoStartBtn');
if (backBtn) backBtn.addEventListener('click', closeCS);
if (startBtn) startBtn.addEventListener('click', closeCS);

// Click backdrop to close
document.addEventListener('click', function(e) {
  var ov = document.getElementById('csOverlay');
  if (ov && ov.classList.contains('open') && e.target === ov) closeCS();
});

/* ── Lightbox ────────────────────────────────────────── */
function openLB(idx) {
  var lb = document.getElementById('galLightbox');
  var img = document.getElementById('galImg');
  if (!lb || !img || !galImages.length) return;
  galIdx = Math.max(0, Math.min(idx, galImages.length - 1));
  img.src = galImages[galIdx];
  lb.classList.add('open');
}
function closeLB() {
  var lb = document.getElementById('galLightbox');
  var img = document.getElementById('galImg');
  if (lb) lb.classList.remove('open');
  setTimeout(function() { if (img) img.src = ''; }, 300);
}
window.closeLB = closeLB;

var gc = document.getElementById('galClose');
var gp = document.getElementById('galPrev');
var gn = document.getElementById('galNext');
if (gc) gc.addEventListener('click', closeLB);
if (gp) gp.addEventListener('click', function() { var img=document.getElementById('galImg'); galIdx=(galIdx-1+galImages.length)%galImages.length; if(img) img.src=galImages[galIdx]; });
if (gn) gn.addEventListener('click', function() { var img=document.getElementById('galImg'); galIdx=(galIdx+1)%galImages.length; if(img) img.src=galImages[galIdx]; });
document.addEventListener('click', function(e) { if (e.target === document.getElementById('galLightbox')) closeLB(); });

/* ── Keyboard ────────────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('galLightbox');
  var ov = document.getElementById('csOverlay');
  if (lb && lb.classList.contains('open')) {
    var img = document.getElementById('galImg');
    if (e.key === 'Escape') { closeLB(); return; }
    if (e.key === 'ArrowLeft') { galIdx=(galIdx-1+galImages.length)%galImages.length; if(img) img.src=galImages[galIdx]; }
    if (e.key === 'ArrowRight') { galIdx=(galIdx+1)%galImages.length; if(img) img.src=galImages[galIdx]; }
    return;
  }
  if (e.key === 'Escape' && ov && ov.classList.contains('open')) closeCS();
});

/* ── Wire [data-cs] triggers ─────────────────────────── */
function wire() {
  document.querySelectorAll('[data-cs]').forEach(function(el) {
    if (el._wired) return;
    var slug = el.getAttribute('data-cs');
    if (!slug || !CS[slug]) return;
    el._wired = true;

    function go(e) { if (e) e.preventDefault(); openCS(slug); }

    if (el.tagName === 'ARTICLE') {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(e) {
        // Let real navigation links work; intercept only # and cs-page links
        var a = e.target.closest('a');
        if (a) {
          var h = a.getAttribute('href') || '';
          if (h !== '#' && !h.startsWith('case-study-post')) return;
          e.preventDefault();
        }
        openCS(slug);
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); openCS(slug); }
      });
    } else {
      el.addEventListener('click', go);
      el.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
    }

    // Wire "View" labels inside cards
    el.querySelectorAll('.cs-link,.wk-card-link,.mini-link').forEach(function(child) {
      if (child._wired) return;
      child._wired = true;
      child.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); openCS(slug); });
    });
  });
}

wire();
// Re-wire after DOM changes (service panel mini-cards)
new MutationObserver(wire).observe(document.body, { childList: true, subtree: true });

})();
