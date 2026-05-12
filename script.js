// ===== Custom Cursor =====
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (dot && ring) {
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animateCursor() {
    dx += (mx - dx) * 0.18; dy += (my - dy) * 0.18;
    dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    ring.style.transform = `translate(${dx - 18}px, ${dy - 18}px)`;
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button, input, textarea, .btn-cta, .btn-outline').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ===== Navbar scroll =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== Hamburger =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Fade-in on scroll =====
const faders = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
faders.forEach(el => fadeObserver.observe(el));

// ===== Before/After Sliders =====
document.querySelectorAll('.ba-slider input[type="range"]').forEach(slider => {
  const afterEl = slider.parentElement.querySelector('.ba-after');
  slider.addEventListener('input', () => {
    const val = slider.value;
    afterEl.style.clipPath = `inset(0 0 0 ${val}%)`;
  });
});

// ===== Contact Form =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#2ecc71';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 2500);
  });
}
