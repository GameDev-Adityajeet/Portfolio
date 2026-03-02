/* ===========================================
   PORTFOLIO SCRIPT — Three.js 3D Scene
   + Typewriter, Tilt Cards, Modals, Nav
   =========================================== */

// ─── THREE.JS SCENE SETUP ─────────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // ─── LIGHTS ─────
    const ambientLight = new THREE.AmbientLight(0x00f5ff, 0.25);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5ff, 3.0, 60);
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7b2fff, 2.5, 60);
    pointLight2.position.set(-12, -8, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff3cac, 2.0, 40);
    pointLight3.position.set(0, -14, 8);
    scene.add(pointLight3);

    // ─── HERO 3D OBJECT: Glowing Icosahedron ─────
    const heroGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const heroMat = new THREE.MeshStandardMaterial({
        color: 0x0d1220,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false,
    });
    const heroCrystal = new THREE.Mesh(heroGeo, heroMat);
    heroCrystal.position.set(7, 0, 0);
    scene.add(heroCrystal);

    // Wireframe overlay on hero crystal
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.25
    });
    const wireOverlay = new THREE.Mesh(heroGeo, wireMat);
    wireOverlay.position.set(7, 0, 0);
    scene.add(wireOverlay);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.5, wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(7, 0, 0);
    scene.add(coreMesh);

    // ─── FLOATING PARTICLES ─────
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [
        new THREE.Color(0x00f5ff),
        new THREE.Color(0x7b2fff),
        new THREE.Color(0xff3cac),
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.22, vertexColors: true,
        transparent: true, opacity: 0.85, sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── FLOATING MINI SHAPES ─────
    const miniShapes = [];
    const miniGeos = [
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.55, 0),
        new THREE.BoxGeometry(0.7, 0.7, 0.7),
        new THREE.IcosahedronGeometry(0.45, 0),
    ];
    const miniColors = [0x00f5ff, 0x7b2fff, 0xff3cac, 0x00f5ff];

    for (let i = 0; i < 14; i++) {
        const geo = miniGeos[i % miniGeos.length];
        const mat = new THREE.MeshStandardMaterial({
            color: miniColors[i % miniColors.length],
            emissive: miniColors[i % miniColors.length],
            emissiveIntensity: 0.6,
            metalness: 0.8, roughness: 0.2, wireframe: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10 - 4
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData.rotX = (Math.random() - 0.5) * 0.018;
        mesh.userData.rotY = (Math.random() - 0.5) * 0.018;
        mesh.userData.baseY = mesh.position.y;
        mesh.userData.floatSpeed = 0.5 + Math.random() * 1.2;
        mesh.userData.floatAmp = 0.6 + Math.random() * 0.8;
        mesh.userData.phase = Math.random() * Math.PI * 2;
        scene.add(mesh);
        miniShapes.push(mesh);
    }

    // ─── MOUSE PARALLAX ─────
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ─── ANIMATION LOOP ─────
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Hero crystal rotation
        heroCrystal.rotation.y = t * 0.28;
        heroCrystal.rotation.x = t * 0.14;
        wireOverlay.rotation.y = heroCrystal.rotation.y;
        wireOverlay.rotation.x = heroCrystal.rotation.x;
        coreMesh.rotation.y = -t * 0.5;
        coreMesh.rotation.x = t * 0.3;

        // Pulsing core
        const pulse = 1 + Math.sin(t * 2.5) * 0.12;
        coreMesh.scale.set(pulse, pulse, pulse);
        coreMat.emissiveIntensity = 1.2 + Math.sin(t * 2.5) * 0.6;

        // Particles drift
        particles.rotation.y = t * 0.018;
        particles.rotation.x = t * 0.008;

        // Floating mini shapes
        miniShapes.forEach(m => {
            m.rotation.x += m.userData.rotX;
            m.rotation.y += m.userData.rotY;
            m.position.y = m.userData.baseY + Math.sin(t * m.userData.floatSpeed + m.userData.phase) * m.userData.floatAmp;
        });

        // Camera mouse parallax
        camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.04;
        camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // ─── RESIZE HANDLER ─────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ─── TYPEWRITER EFFECT ────────────────────────────────────────────────────────
(function () {
    const words = ['Unreal Engine RPGs', 'Unity FPS Games', 'Immersive 2D Worlds', 'Enemy AI Systems', 'Game Jam Projects'];
    const el = document.getElementById('typewriter');
    let wi = 0, ci = 0, deleting = false;

    function tick() {
        const word = words[wi];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { deleting = true; return setTimeout(tick, 1800); }
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        }
        setTimeout(tick, deleting ? 55 : 95);
    }
    tick();
})();

// ─── TILT 3D CARD EFFECT ─────────────────────────────────────────────────────
(function () {
    const MAX = 12; // max tilt degrees
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `perspective(800px) rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg) scale(1.03)`;
            card.style.boxShadow = `0 25px 50px rgba(0,0,0,0.5), ${dx * -8}px ${dy * -8}px 30px rgba(0,245,255,0.15)`;
            // Move the glow highlight
            const glow = card.querySelector('.card-glow');
            if (glow) {
                const mx = ((e.clientX - rect.left) / rect.width) * 100;
                const my = ((e.clientY - rect.top) / rect.height) * 100;
                glow.style.setProperty('--mx', mx + '%');
                glow.style.setProperty('--my', my + '%');
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.boxShadow = '';
        });
    });
})();

// ─── NAVBAR SCROLL EFFECT + ACTIVE LINK ──────────────────────────────────────
(function () {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.hero, .section');

    window.addEventListener('scroll', () => {
        // Darken navbar on scroll
        navbar.style.background = window.scrollY > 60
            ? 'rgba(6,10,16,0.95)' : 'rgba(6,10,16,0.7)';

        // Highlight active nav section
        let current = 'home';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });

    navLinks.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // close mobile menu if open
            document.getElementById('nav-links').classList.remove('open');
        });
    });
})();

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open');
}

// ─── MODAL LOGIC ─────────────────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');

function openModal(id) {
    document.getElementById(id).classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
overlay.addEventListener('click', () => {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// ─── SCROLL REVEAL ANIMATION ─────────────────────────────────────────────────
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.skill-card, .project-card, .about-card, .about-text, .contact-card, .timeline-item').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
