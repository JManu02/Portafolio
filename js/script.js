/* =============================================
   script.js — Portfolio José Manuel Varela
   ============================================= */

// ── 1. CURSOR PERSONALIZADO ──────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .skill-group, .project-card, .contact-card, .cv-item, .gallery-btn, .dot').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});


// ── 2. NAVBAR: scroll + mobile ───────────────
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));


// ── 3. SCROLL TO TOP ─────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ── 4. REVEAL ON SCROLL ──────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── 5. TYPED EFFECT ──────────────────────────
const typedEl   = document.querySelector('.typed-name');
const fullText  = 'José Manuel\nVarela Méndez.';
let charIndex   = 0;
let typingStarted = false;

function typeCharacter() {
  if (charIndex < fullText.length) {
    const char = fullText[charIndex];
    typedEl.innerHTML += char === '\n' ? '<br>' : char;
    charIndex++;
    setTimeout(typeCharacter, (char === '.' || char === ',') ? 280 : 55);
  }
}

new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !typingStarted) {
      typingStarted = true;
      setTimeout(typeCharacter, 600);
      obs.disconnect();
    }
  });
}, { threshold: 0.5 }).observe(document.querySelector('.hero'));


// ── 6. CONTADOR ANIMADO ──────────────────────
function animateCounter(el, target, duration = 1500) {
  const start   = performance.now();
  const isYear  = target >= 2000;
  const update  = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = isYear ? current : current + (target >= 10 ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isYear ? target : target + (target >= 10 ? '+' : '');
  };
  requestAnimationFrame(update);
}

let countersStarted = false;
new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num').forEach(el => animateCounter(el, parseInt(el.dataset.count, 10)));
      obs.disconnect();
    }
  });
}, { threshold: 0.5 }).observe(document.querySelector('.stats'));


// ── 7. PARALLAX HERO ─────────────────────────
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (hero && s < window.innerHeight) {
    hero.style.transform = `translateY(${s * 0.15}px)`;
    hero.style.opacity   = String(1 - s / 600);
  }
}, { passive: true });


// ── 8. GALERÍA (slider) ──────────────────────
/*
  Estado de cada galería guardado en un objeto:
    galleries['monka'] = { index: 0, total: 3 }
    galleries['merca'] = { index: 0, total: 4 }
*/
const galleries = {};

document.querySelectorAll('[data-gallery]').forEach(galleryEl => {
  const id    = galleryEl.dataset.gallery;
  const track = galleryEl.querySelector('.gallery-track');
  const total = track ? track.children.length : 0;
  galleries[id] = { index: 0, total };
});

/**
 * Mueve la galería indicada en la dirección dada (+1 / -1).
 * Llamado desde los botones en el HTML con onclick.
 */
function moveGallery(id, direction) {
  const state = galleries[id];
  if (!state) return;

  state.index = (state.index + direction + state.total) % state.total;
  updateGallery(id);
}

function updateGallery(id) {
  const state  = galleries[id];
  const track  = document.getElementById('gallery-' + id);
  const dotsEl = document.getElementById('dots-' + id);
  if (!track || !dotsEl) return;

  // Mover el track
  track.style.transform = `translateX(-${state.index * 100}%)`;

  // Actualizar puntos
  dotsEl.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === state.index);
  });
}

// Click en los puntos
document.querySelectorAll('[id^="dots-"]').forEach(dotsEl => {
  const id = dotsEl.id.replace('dots-', '');
  dotsEl.querySelectorAll('.dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (galleries[id]) {
        galleries[id].index = i;
        updateGallery(id);
      }
    });
  });
});

// Autoplay: avanza cada 4 s si el usuario no interactúa
const AUTOPLAY_MS = 4000;
let autoplayTimers = {};

function startAutoplay(id) {
  clearInterval(autoplayTimers[id]);
  autoplayTimers[id] = setInterval(() => moveGallery(id, 1), AUTOPLAY_MS);
}

function stopAutoplay(id) {
  clearInterval(autoplayTimers[id]);
}

Object.keys(galleries).forEach(id => {
  startAutoplay(id);
  const galleryEl = document.querySelector(`[data-gallery="${id}"]`);
  if (galleryEl) {
    galleryEl.addEventListener('mouseenter', () => stopAutoplay(id));
    galleryEl.addEventListener('mouseleave', () => startAutoplay(id));
    // Touch support
    let touchStartX = 0;
    galleryEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    galleryEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) moveGallery(id, diff > 0 ? 1 : -1);
    }, { passive: true });
  }
});


// ── 9. FEEDBACK BOTÓN DESCARGAR CV ───────────
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const original = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span>✓</span> ¡Descargando!';
    downloadBtn.style.background = '#34d399';
    setTimeout(() => {
      downloadBtn.innerHTML = original;
      downloadBtn.style.background = '';
    }, 2500);
  });
}


// ── 10. ACTIVE NAV LINK POR SECCIÓN ──────────
const navLinks = document.querySelectorAll('nav a[href^="#"]');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + entry.target.id;
        link.style.color = isActive ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe(document.querySelectorAll('section[id]'));

// Corregir: observar todas las secciones por separado
document.querySelectorAll('section[id]').forEach(section => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = isActive ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(section);
});