/* ── TYPEWRITER ── */
const roles = [
  'Ingeniero en Sistemas',
  'Full Stack Developer',
  'Builder de soluciones web',
  'Backend · Frontend · Mobile'
];
let ri = 0, ci = 0, del = false;
const tw = document.getElementById('tw');

function type() {
  const cur = roles[ri];
  if (!del) {
    tw.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
  } else {
    tw.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, del ? 48 : 75);
}
type();

/* ── SCROLL REVEAL ── */
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(
  es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }); },
  { threshold: .1, rootMargin: '0px 0px -35px 0px' }
);
revEls.forEach(el => revObs.observe(el));

/* hero reveals immediately on load */
document.querySelectorAll('#hero .reveal').forEach((el, i) =>
  setTimeout(() => el.classList.add('vis'), 80 + i * 80)
);

/* ── ANIMATED COUNTERS ── */
document.querySelectorAll('.cnt').forEach(el => {
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const tgt = +el.dataset.t;
    const dur = tgt > 500 ? 1400 : 700;
    const step = tgt / (dur / 16);
    let v = 0;
    const t = setInterval(() => {
      v += step;
      if (v >= tgt) { v = tgt; clearInterval(t); }
      el.textContent = Math.floor(v);
    }, 16);
  }, { threshold: .6 });
  obs.observe(el);
});

/* ── IMAGE GALLERIES ── */
const G = {};
document.querySelectorAll('.gallery[data-g]').forEach(g => {
  const id = +g.dataset.g;
  G[id] = {
    cur: 0,
    track: g.querySelector('.gal-track'),
    slides: g.querySelectorAll('.gal-slide'),
    dots: g.querySelectorAll('.gal-dot')
  };
});

function upd(id) {
  const g = G[id];
  g.track.style.transform = `translateX(-${g.cur * 100}%)`;
  g.dots.forEach((d, i) => d.classList.toggle('on', i === g.cur));
}
function ns(id) { const g = G[id]; g.cur = (g.cur + 1) % g.slides.length; upd(id); }
function ps(id) { const g = G[id]; g.cur = (g.cur - 1 + g.slides.length) % g.slides.length; upd(id); }
function gs(id, i) { G[id].cur = i; upd(id); }

/* auto-advance (pauses on hover) */
let autoId = setInterval(() => Object.keys(G).forEach(id => ns(+id)), 3800);
document.querySelectorAll('.gallery').forEach(g => {
  g.addEventListener('mouseenter', () => clearInterval(autoId));
  g.addEventListener('mouseleave', () => {
    autoId = setInterval(() => Object.keys(G).forEach(id => ns(+id)), 3800);
  });
});

/* touch swipe support */
document.querySelectorAll('.gallery[data-g]').forEach(g => {
  let sx = 0;
  g.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  g.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { dx < 0 ? ns(+g.dataset.g) : ps(+g.dataset.g); }
  }, { passive: true });
});

/* ── ACTIVE NAV ON SCROLL ── */
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ── MOBILE HAMBURGER ── */
const hamBtn = document.getElementById('ham');
const mob = document.getElementById('mob');
hamBtn.addEventListener('click', () => mob.classList.toggle('open'));
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));