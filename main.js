/* ===== ELITE EDITING HUB — MAIN JAVASCRIPT ===== */

(function () {
  'use strict';

  /* ========== LOADER ========== */
  window.addEventListener('load', () => {
    gsap.to('#loader', {
      opacity: 0,
      duration: 0.6,
      delay: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
      }
    });
  });

  /* ========== CUSTOM CURSOR ========== */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow cursor on interactive elements
  document.querySelectorAll('a, button, .btn, input, select, textarea, .ba-range').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '14px';
      dot.style.height = '14px';
      ring.style.width = '50px';
      ring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });

  /* ========== MOBILE MENU ========== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========== THREE.JS 3D BACKGROUND ========== */
  const canvas = document.getElementById('bgCanvas');
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 500 : 3000;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x080807, 1);

  // Particles
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 120;
    positions[i + 1] = (Math.random() - 0.5) * 120;
    positions[i + 2] = (Math.random() - 0.5) * 80;
    velocities[i] = (Math.random() - 0.5) * 0.015;
    velocities[i + 1] = (Math.random() - 0.5) * 0.015;
    velocities[i + 2] = (Math.random() - 0.5) * 0.01;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xC9A84C,
    size: 0.18,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Torus Knot
  const torusGeo = new THREE.TorusKnotGeometry(12, 3, 100, 16);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xC9A84C,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending
  });
  const torusKnot = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torusKnot);

  // Lines connecting nearby particles
  const LINE_MAX = isMobile ? 80 : 300;
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(LINE_MAX * 6);
  const lineColors = new Float32Array(LINE_MAX * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Mouse tracking for parallax
  let targetMouseX = 0, targetMouseY = 0;
  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animateThree() {
    requestAnimationFrame(animateThree);
    const t = clock.getElapsedTime();

    // Camera drift
    camera.position.x += (targetMouseX * 5 - camera.position.x) * 0.02;
    camera.position.y += (-targetMouseY * 5 - camera.position.y) * 0.02;
    camera.position.x += Math.sin(t * 0.15) * 0.02;
    camera.position.y += Math.cos(t * 0.12) * 0.02;
    camera.lookAt(0, 0, 0);

    // Rotate torus knot
    torusKnot.rotation.x += 0.0015;
    torusKnot.rotation.y += 0.002;

    // Move particles
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i];
      pos[i + 1] += velocities[i + 1];
      pos[i + 2] += velocities[i + 2];
      // Wrap around
      if (pos[i] > 60) pos[i] = -60;
      if (pos[i] < -60) pos[i] = 60;
      if (pos[i + 1] > 60) pos[i + 1] = -60;
      if (pos[i + 1] < -60) pos[i + 1] = 60;
      if (pos[i + 2] > 40) pos[i + 2] = -40;
      if (pos[i + 2] < -40) pos[i + 2] = 40;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Update connecting lines
    let lineIdx = 0;
    const threshold = isMobile ? 8 : 6;
    const lp = lineGeo.attributes.position.array;
    const lc = lineGeo.attributes.color.array;
    const step = isMobile ? 3 : 9; // Sample fewer particles for perf
    for (let i = 0; i < pos.length && lineIdx < LINE_MAX; i += step * 3) {
      for (let j = i + step * 3; j < pos.length && lineIdx < LINE_MAX; j += step * 3) {
        const dx = pos[i] - pos[j];
        const dy = pos[i + 1] - pos[j + 1];
        const dz = pos[i + 2] - pos[j + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          const alpha = 1 - dist / threshold;
          const k = lineIdx * 6;
          lp[k] = pos[i]; lp[k + 1] = pos[i + 1]; lp[k + 2] = pos[i + 2];
          lp[k + 3] = pos[j]; lp[k + 4] = pos[j + 1]; lp[k + 5] = pos[j + 2];
          lc[k] = 0.79 * alpha; lc[k + 1] = 0.66 * alpha; lc[k + 2] = 0.30 * alpha;
          lc[k + 3] = 0.79 * alpha; lc[k + 4] = 0.66 * alpha; lc[k + 5] = 0.30 * alpha;
          lineIdx++;
        }
      }
    }
    // Clear unused lines
    for (let i = lineIdx * 6; i < lp.length; i++) {
      lp[i] = 0; lc[i] = 0;
    }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx * 2);

    renderer.render(scene, camera);
  }
  animateThree();

  /* ========== GSAP SCROLL ANIMATIONS ========== */
  gsap.registerPlugin(ScrollTrigger);

  // Reveal all .anim-reveal elements
  gsap.utils.toArray('.anim-reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Hero text staggered reveal
  gsap.timeline({ delay: 2.2 })
    .to('.hero-heading', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .to('.stats-strip', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2');

  /* ========== COUNT-UP ANIMATION ========== */
  const countEls = document.querySelectorAll('.count-up');
  countEls.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  /* ========== SVG DRAW-ON ANIMATION ========== */
  document.querySelectorAll('.icon-draw').forEach(svg => {
    ScrollTrigger.create({
      trigger: svg,
      start: 'top 85%',
      once: true,
      onEnter: () => svg.classList.add('drawn')
    });
  });

  /* ========== BEFORE / AFTER SLIDERS ========== */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const range = slider.querySelector('.ba-range');
    const afterPanel = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');

    range.addEventListener('input', () => {
      const val = range.value;
      afterPanel.style.clipPath = `inset(0 0 0 ${val}%)`;
      handle.style.left = val + '%';
    });
  });

  /* ========== CONTACT FORM ========== */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  function showToast(message, type) {
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    // Validate
    if (!name || !email || !phone || !service || !message) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Message received! We will contact you within 24 hours.', 'success');
        form.reset();
      } else {
        showToast(data.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    }
  });

  /* ========== SMOOTH SCROLL FOR NAV ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ========== NAVBAR SCROLL STATE ========== */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(13,12,10,.92)';
    } else {
      nav.style.background = 'rgba(13,12,10,.7)';
    }
  });

})();
