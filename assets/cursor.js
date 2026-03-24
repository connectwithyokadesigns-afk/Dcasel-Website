/*
 * cursor.js  —  Dcasel Planet Cursor System v2
 * Self-initialising. Requires cursor HTML injected by this script.
 * Injects: #curCanvas, #cur3, #curAtmo, #curRing, #curOrb,
 *          #curNoise, #curCorona, #curLbl  (if not already in DOM)
 */
(function(){
'use strict';

/* ── Guard: only fine-pointer devices ── */
if(!window.matchMedia('(pointer:fine)').matches) return;

/* ── Inject cursor HTML if not present ── */
if(!document.getElementById('cur3')){
  const canvas = document.createElement('canvas');
  canvas.id = 'curCanvas';
  canvas.setAttribute('aria-hidden','true');

  const cur3 = document.createElement('div');
  cur3.id = 'cur3';
  cur3.setAttribute('aria-hidden','true');
  cur3.innerHTML =
    '<div id="curAtmo"></div>' +
    '<div id="curRing"></div>' +
    '<div id="curOrb">' +
      '<div id="curNoise"></div>' +
      '<div id="curCorona"></div>' +
    '</div>';

  const lbl = document.createElement('div');
  lbl.id = 'curLbl';
  lbl.setAttribute('aria-hidden','true');

  /* cur3 MUST be injected before canvas so the CSS sibling selector
     #cur3.hov ~ #curCanvas { opacity:1 } fires correctly */
  document.body.appendChild(cur3);
  document.body.appendChild(canvas);
  document.body.appendChild(lbl);
}

/* ── Element refs ── */
const wrap = document.getElementById('cur3');
const orb  = document.getElementById('curOrb');
const ring = document.getElementById('curRing');
const atmo = document.getElementById('curAtmo');
const cv   = document.getElementById('curCanvas');
const lbl  = document.getElementById('curLbl');
const ctx  = cv.getContext('2d');

function resizeCv(){ cv.width=innerWidth; cv.height=innerHeight; }
resizeCv();
window.addEventListener('resize', resizeCv, {passive:true});

/* ── Helpers ── */
const PI2 = Math.PI * 2;

function orbitPos(cx, cy, rx, tilt, angle){
  const ry = rx * (0.28 + tilt * 0.35);
  return {
    x: cx + Math.cos(angle) * rx,
    y: cy + Math.sin(angle) * ry,
    z: (Math.sin(angle) + 1) * 0.5
  };
}

/* ── Body classes ── */
class Moon {
  constructor(orbitR, speed, size, color, tilt, phaseOffset){
    this.orbitR=orbitR; this.speed=speed; this.size=size;
    this.color=color; this.tilt=tilt; this.angle=phaseOffset;
    this.trailPts=[];
  }
  update(cx,cy){
    this.angle += this.speed;
    const p = orbitPos(cx,cy,this.orbitR,this.tilt,this.angle);
    this.x=p.x; this.y=p.y; this.z=p.z;
    this.trailPts.push({x:p.x,y:p.y,a:.38*p.z});
    if(this.trailPts.length>28) this.trailPts.shift();
  }
  draw(ctx){
    const tr=this.trailPts;
    for(let i=1;i<tr.length;i++){
      ctx.save();
      ctx.globalAlpha=tr[i].a*(i/tr.length)*0.45;
      ctx.strokeStyle=this.color; ctx.lineWidth=this.size*0.45*(i/tr.length);
      ctx.lineCap='round'; ctx.beginPath();
      ctx.moveTo(tr[i-1].x,tr[i-1].y); ctx.lineTo(tr[i].x,tr[i].y);
      ctx.stroke(); ctx.restore();
    }
    const sz=this.size*(0.65+this.z*0.35);
    const grd=ctx.createRadialGradient(this.x-sz*.3,this.y-sz*.3,sz*.05,this.x,this.y,sz);
    grd.addColorStop(0,'rgba(255,255,255,.55)');
    grd.addColorStop(0.35,this.color);
    grd.addColorStop(1,'rgba(0,0,0,.7)');
    ctx.save(); ctx.globalAlpha=0.72+this.z*0.28;
    ctx.beginPath(); ctx.arc(this.x,this.y,sz,0,PI2);
    ctx.fillStyle=grd; ctx.fill(); ctx.restore();
  }
}

class Asteroid {
  constructor(orbitR, speed, tilt, phaseOffset, col){
    this.orbitR=orbitR; this.speed=speed*(Math.random()>.5?1:-1);
    this.tilt=tilt; this.angle=phaseOffset; this.col=col;
    this.pts=Array.from({length:7},(_,i)=>{
      const a=(i/7)*PI2; const r=0.62+Math.random()*0.38;
      return [Math.cos(a)*r, Math.sin(a)*r];
    });
    this.rx=1.0+Math.random()*1.2;
    this.ry=this.rx*(0.55+Math.random()*.3);
    this.rot=Math.random()*PI2;
  }
  update(cx,cy){
    this.angle+=this.speed;
    const p=orbitPos(cx,cy,this.orbitR,this.tilt,this.angle);
    this.x=p.x; this.y=p.y; this.z=p.z;
  }
  draw(ctx){
    const scale=0.55+this.z*0.45;
    ctx.save(); ctx.globalAlpha=(0.38+this.z*0.42);
    ctx.translate(this.x,this.y); ctx.rotate(this.rot+this.angle*0.3);
    ctx.beginPath();
    const rx=this.rx*scale, ry=this.ry*scale;
    this.pts.forEach(([px,py],i)=>{
      const x=px*rx,y=py*ry; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    const g=ctx.createRadialGradient(-rx*.3,-ry*.3,0,0,0,rx);
    g.addColorStop(0,'rgba(255,255,255,.35)'); g.addColorStop(1,this.col);
    ctx.fillStyle=g; ctx.fill(); ctx.restore();
  }
}

class ShootingStar {
  constructor(cx,cy,range,col){ this.reset(cx,cy,range,col); this.alpha=0; }
  reset(cx,cy,range,col){
    const angle=Math.random()*PI2;
    const dist=range*1.4+Math.random()*range*.8;
    this.x=cx+Math.cos(angle)*dist; this.y=cy+Math.sin(angle)*dist;
    const dir=angle+Math.PI*0.5+(Math.random()-.5)*0.9;
    const spd=2.8+Math.random()*3.2;
    this.vx=Math.cos(dir)*spd; this.vy=Math.sin(dir)*spd;
    this.len=18+Math.random()*28; this.col=col;
    this.alpha=0.9+Math.random()*.1;
    this.decay=0.025+Math.random()*0.035;
    this.cx=cx; this.cy=cy; this.range=range;
  }
  update(cx,cy,range,col){
    this.cx=cx; this.cy=cy;
    this.x+=this.vx; this.y+=this.vy;
    this.alpha-=this.decay;
    if(this.alpha<=0) this.reset(cx,cy,range,col);
  }
  draw(ctx){
    ctx.save(); ctx.globalAlpha=Math.max(0,this.alpha);
    const h=Math.hypot(this.vx,this.vy);
    const g=ctx.createLinearGradient(
      this.x,this.y,
      this.x-this.vx/h*this.len,
      this.y-this.vy/h*this.len
    );
    g.addColorStop(0,this.col); g.addColorStop(1,'transparent');
    ctx.strokeStyle=g; ctx.lineWidth=1.1; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x-this.vx/h*this.len, this.y-this.vy/h*this.len);
    ctx.stroke(); ctx.restore();
  }
}

/* ── Planet + Sun data ── */
const SUN_DEF = {
  size:20,
  bg:`radial-gradient(circle at 34% 26%,rgba(255,255,255,.95) 0%,rgba(255,225,100,.9) 12%,#f05818 40%,#c03000 66%,#7a1600 100%)`,
  shadow:`0 0 0 1.5px rgba(212,76,39,.4),0 0 10px 3px rgba(212,76,39,.5),0 0 22px 6px rgba(212,76,39,.18)`,
  atmoColor:'rgba(255,100,20,.28)',
  isSun:true,
  satellites:[{type:'star',count:3,range:44,col:'rgba(255,180,60,.75)'}]
};

const PLANETS = [
  { name:'Mercury', size:16,
    bg:`radial-gradient(ellipse 55% 40% at 30% 27%,rgba(255,255,255,.11) 0%,transparent 70%),radial-gradient(circle at 35% 29%,#d8d2c8 0%,#8a8078 48%,#46403a 100%)`,
    shadow:`0 0 0 1.5px rgba(140,132,122,.5),0 0 10px 3px rgba(120,112,102,.28)`,
    atmoColor:'rgba(180,170,158,.18)',
    satellites:[{type:'asteroids',count:9,orbitR:26,spread:5,speed:.028,tilt:.42,col:'#9a9088'}]
  },
  { name:'Venus', size:21,
    bg:`repeating-linear-gradient(173deg,rgba(255,218,82,.18) 0px,rgba(255,218,82,.0) 3px,rgba(195,132,12,.14) 4px,rgba(195,132,12,.0) 8px),radial-gradient(circle at 36% 27%,#fff8c0 0%,#e2ac22 40%,#906000 100%)`,
    shadow:`0 0 0 1.5px rgba(210,160,22,.5),0 0 12px 4px rgba(210,160,22,.35)`,
    atmoColor:'rgba(240,200,40,.3)',
    satellites:[
      {type:'asteroids',count:12,orbitR:30,spread:4,speed:.022,tilt:.38,col:'#c8a020'},
      {type:'star',count:2,range:48,col:'rgba(255,230,100,.7)'}
    ]
  },
  { name:'Earth', size:21,
    bg:`radial-gradient(ellipse 42% 52% at 63% 44%,rgba(32,152,52,.62) 0%,transparent 100%),radial-gradient(ellipse 26% 22% at 24% 64%,rgba(32,152,52,.46) 0%,transparent 100%),radial-gradient(circle at 35% 26%,#c0ecff 0%,#1880d8 38%,#0a3a7c 100%)`,
    shadow:`0 0 0 1.5px rgba(28,108,210,.55),0 0 12px 4px rgba(28,108,210,.38)`,
    atmoColor:'rgba(80,160,255,.25)',
    satellites:[
      {type:'moon',orbitR:30,speed:.034,size:4.5,color:'#d8d4cc',tilt:.38,phase:0},
      {type:'moon',orbitR:24,speed:.072,size:1.8,color:'#e0e8f0',tilt:.55,phase:2.1}
    ]
  },
  { name:'Mars', size:19,
    bg:`radial-gradient(ellipse 36% 16% at 50% 6%,rgba(255,255,255,.65) 0%,transparent 100%),radial-gradient(circle at 36% 27%,#faa882 0%,#d44c27 40%,#7c2210 100%)`,
    shadow:`0 0 0 1.5px rgba(212,76,39,.6),0 0 12px 4px rgba(212,76,39,.45)`,
    atmoColor:'rgba(210,80,30,.28)',
    satellites:[
      {type:'moon',orbitR:26,speed:.058,size:3.2,color:'#b8a898',tilt:.3,phase:0},
      {type:'moon',orbitR:34,speed:.031,size:2.2,color:'#a89888',tilt:.48,phase:1.6},
      {type:'asteroids',count:7,orbitR:42,spread:4,speed:.018,tilt:.44,col:'#c07050'}
    ]
  },
  { name:'Jupiter', size:26,
    bg:`repeating-linear-gradient(178deg,rgba(212,115,52,.26) 0px,rgba(212,115,52,.0) 2px,rgba(248,208,148,.22) 3px,rgba(248,208,148,.0) 5px,rgba(188,88,36,.22) 6px,rgba(188,88,36,.0) 8px,rgba(248,208,148,.18) 9px,rgba(248,208,148,.0) 11px),radial-gradient(circle at 36% 27%,#fce4b0 0%,#d08040 38%,#804010 100%)`,
    grs:true,
    shadow:`0 0 0 1.5px rgba(195,115,42,.5),0 0 14px 5px rgba(195,115,42,.32)`,
    atmoColor:'rgba(200,130,50,.22)',
    satellites:[
      {type:'moon',orbitR:34,speed:.052,size:4.8,color:'#e8c840',tilt:.28,phase:0},
      {type:'moon',orbitR:43,speed:.038,size:4.0,color:'#d0c8c0',tilt:.35,phase:2.4},
      {type:'moon',orbitR:54,speed:.026,size:5.2,color:'#a8a098',tilt:.32,phase:4.8},
      {type:'asteroids',count:14,orbitR:64,spread:5,speed:.014,tilt:.38,col:'#c09060'},
      {type:'star',count:3,range:72,col:'rgba(255,200,120,.65)'}
    ]
  },
  { name:'Saturn', size:22,
    bg:`repeating-linear-gradient(175deg,rgba(255,208,88,.22) 0px,rgba(255,208,88,.0) 2px,rgba(178,112,14,.2) 3px,rgba(178,112,14,.0) 6px,rgba(255,208,88,.16) 7px,rgba(255,208,88,.0) 10px),radial-gradient(circle at 35% 28%,#feeaa0 0%,#d09818 40%,#7c5008 100%)`,
    hasRing:true,
    shadow:`0 0 0 1.5px rgba(205,158,22,.5),0 0 14px 5px rgba(205,158,22,.32)`,
    atmoColor:'rgba(220,175,30,.22)',
    satellites:[
      {type:'moon',orbitR:38,speed:.028,size:5.5,color:'#d4a840',tilt:.42,phase:0},
      {type:'moon',orbitR:48,speed:.022,size:3.2,color:'#e8f0f8',tilt:.38,phase:1.8},
      {type:'moon',orbitR:30,speed:.042,size:2.8,color:'#c8c4bc',tilt:.32,phase:3.5},
      {type:'asteroids',count:22,orbitR:34,spread:7,speed:.016,tilt:.42,col:'#c8a840'},
      {type:'asteroids',count:18,orbitR:44,spread:5,speed:.012,tilt:.44,col:'#b89030'},
      {type:'star',count:2,range:66,col:'rgba(255,235,140,.6)'}
    ]
  },
  { name:'Neptune', size:21,
    bg:`repeating-linear-gradient(161deg,rgba(148,208,255,.16) 0px,rgba(148,208,255,.0) 4px,rgba(76,122,228,.14) 5px,rgba(76,122,228,.0) 9px),radial-gradient(circle at 34% 27%,#c4e4ff 0%,#2c5ce0 38%,#0a1a8c 100%)`,
    shadow:`0 0 0 1.5px rgba(52,96,215,.55),0 0 13px 5px rgba(52,96,215,.38)`,
    atmoColor:'rgba(80,130,255,.28)',
    satellites:[
      {type:'moon',orbitR:32,speed:-.038,size:4.2,color:'#c8ddf0',tilt:.44,phase:0},
      {type:'moon',orbitR:50,speed:.018,size:2.5,color:'#a0b8d0',tilt:.36,phase:2.8},
      {type:'asteroids',count:10,orbitR:28,spread:3,speed:.025,tilt:.40,col:'#607898'},
      {type:'star',count:4,range:62,col:'rgba(180,220,255,.7)'}
    ]
  }
];

/* ── Runtime state ── */
let activeSatellites=[], activeStars=[];
let isHovering=false, curPlanet=null, lastIdx=-1, grsEl=null;

function buildSatellites(def, cxv, cyv){
  activeSatellites=[]; activeStars=[];
  if(!def.satellites) return;
  def.satellites.forEach(s=>{
    if(s.type==='moon'){
      activeSatellites.push(new Moon(s.orbitR,s.speed,s.size,s.color,s.tilt,s.phase));
    } else if(s.type==='asteroids'){
      for(let i=0;i<s.count;i++){
        const r=s.orbitR+(Math.random()-.5)*s.spread*2;
        const spd=s.speed*(0.7+Math.random()*.6)*(Math.random()>.5?1:-1);
        const ph=Math.random()*PI2;
        activeSatellites.push(new Asteroid(r,spd,s.tilt+(Math.random()-.5)*.12,ph,s.col));
      }
    } else if(s.type==='star'){
      for(let i=0;i<s.count;i++){
        const st=new ShootingStar(cxv,cyv,s.range,s.col);
        st.alpha=Math.random();
        activeStars.push(st);
      }
    }
  });
}

/* ── Render loop ── */
let mx=0, my=0, cx=0, cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX; my=e.clientY;});

/* Move curLbl to follow cursor */
document.addEventListener('mousemove',e=>{
  if(lbl){lbl.style.left=e.clientX+'px'; lbl.style.top=e.clientY+'px';}
});

function sortByZ(a,b){return(a.z||0)-(b.z||0);}

function loop(){
  cx+=(mx-cx)*.2; cy+=(my-cy)*.2;
  wrap.style.left=cx+'px'; wrap.style.top=cy+'px';
  ctx.clearRect(0,0,cv.width,cv.height);

  if(isHovering){
    activeSatellites.forEach(s=>s.update(cx,cy));
    const starDef=curPlanet?.satellites?.find(x=>x.type==='star');
    activeStars.forEach(s=>s.update(cx,cy,starDef?.range||50,starDef?.col||'white'));

    const sorted=[...activeSatellites].sort(sortByZ);
    sorted.filter(s=>s.z<0.5).forEach(s=>s.draw(ctx));

    const haloR=(curPlanet?.size||20)*1.8;
    const hg=ctx.createRadialGradient(cx,cy,0,cx,cy,haloR);
    hg.addColorStop(0,'transparent'); hg.addColorStop(0.6,'transparent');
    hg.addColorStop(1,curPlanet?.atmoColor||'rgba(100,100,200,.15)');
    ctx.save(); ctx.globalAlpha=.55;
    ctx.beginPath(); ctx.arc(cx,cy,haloR,0,PI2);
    ctx.fillStyle=hg; ctx.fill(); ctx.restore();

    sorted.filter(s=>s.z>=0.5).forEach(s=>s.draw(ctx));
    activeStars.forEach(s=>s.draw(ctx));
  }
  requestAnimationFrame(loop);
}
loop();

/* ── Sun / Planet transitions ── */
function showSun(){
  isHovering=false; activeSatellites=[]; activeStars=[];
  wrap.classList.remove('hov','has-ring','has-atmo','is-sun');
  orb.classList.remove('is-sun');
  ring.style.opacity='0'; atmo.style.opacity='0';
  if(grsEl){grsEl.remove();grsEl=null;}

  orb.style.width=SUN_DEF.size+'px'; orb.style.height=SUN_DEF.size+'px';
  orb.style.background=SUN_DEF.bg; orb.style.boxShadow=SUN_DEF.shadow;
  const ao=SUN_DEF.size+10;
  atmo.style.width=ao+'px'; atmo.style.height=ao+'px';
  atmo.style.background=`radial-gradient(circle,${SUN_DEF.atmoColor} 0%,transparent 70%)`;
  requestAnimationFrame(()=>{
    wrap.classList.add('is-sun','has-atmo');
    orb.classList.add('is-sun');
    atmo.style.opacity='1';
  });
}

function showPlanet(p){
  wrap.classList.remove('is-sun','has-ring','has-atmo');
  orb.classList.remove('is-sun');
  if(grsEl){grsEl.remove();grsEl=null;}

  orb.style.width=p.size+'px'; orb.style.height=p.size+'px';
  orb.style.background=p.bg; orb.style.boxShadow=p.shadow;

  const ao=p.size+14;
  atmo.style.width=ao+'px'; atmo.style.height=ao+'px';
  atmo.style.background=`radial-gradient(circle,${p.atmoColor} 0%,transparent 68%)`;

  if(p.hasRing){
    const rw=p.size*2.1, rh=p.size*.55;
    ring.style.width=rw+'px'; ring.style.height=rh+'px';
    ring.style.background=`radial-gradient(ellipse 100% 100% at 50% 50%,transparent 28%,rgba(218,173,45,.55) 36%,rgba(248,213,82,.26) 50%,rgba(218,173,45,.46) 61%,transparent 70%)`;
    ring.style.boxShadow='0 0 5px 1px rgba(218,173,45,.22)';
  }
  if(p.grs){
    grsEl=document.createElement('div');
    grsEl.style.cssText='position:absolute;width:26%;height:18%;background:rgba(172,36,10,.62);border-radius:50%;top:55%;left:56%;transform:translate(-50%,-50%);filter:blur(.7px);pointer-events:none;z-index:2;';
    orb.appendChild(grsEl);
  }
  requestAnimationFrame(()=>{
    wrap.classList.add('hov','has-atmo');
    if(p.hasRing) wrap.classList.add('has-ring');
    atmo.style.opacity='1';
  });

  curPlanet=p;
  buildSatellites(p,cx,cy);
  isHovering=true;
}

function pickPlanet(){
  let i;
  do{i=Math.floor(Math.random()*PLANETS.length);}while(i===lastIdx);
  lastIdx=i; return PLANETS[i];
}

showSun();

/* ── Bind to interactive elements (live — picks up dynamic content) ── */
function bindCursorEvents(){
  document.querySelectorAll('a,button').forEach(el=>{
    if(el._cursorBound) return;
    // Skip nav trigger links — they control dropdowns, not planet effect
    if(el.classList.contains('nav-link')) return;
    el._cursorBound=true;
    el.addEventListener('mouseenter',()=>showPlanet(pickPlanet()));
    el.addEventListener('mouseleave',()=>showSun());
  });
}

/* Initial bind */
bindCursorEvents();

/* Re-bind on DOM mutations (overlays, dynamic content) */
const mo=new MutationObserver(()=>bindCursorEvents());
mo.observe(document.body,{childList:true,subtree:true});

/* ── "View" label on .cs-card elements ── */
function bindCsCards(){
  document.querySelectorAll('.cs-card,.wk-card').forEach(el=>{
    if(el._lblBound) return;
    el._lblBound=true;
    el.addEventListener('mouseenter',()=>{
      if(lbl){lbl.classList.add('vis');lbl.textContent='View';}
    });
    el.addEventListener('mouseleave',()=>{
      if(lbl) lbl.classList.remove('vis');
    });
  });
}
bindCsCards();
const mo2=new MutationObserver(()=>bindCsCards());
mo2.observe(document.body,{childList:true,subtree:true});

})();
