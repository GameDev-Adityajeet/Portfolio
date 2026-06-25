/* ===========================================
   PORTFOLIO SCRIPT — Game UI Theme
   Three.js Scene + Custom Cursor + Glitch Reveals
   =========================================== */

// ─── CUSTOM CURSOR ──────────────────────────────────────────────────────────
(function () {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    function animateRing() {
        dx += (mx - dx) * 0.15;
        dy += (my - dy) * 0.15;
        ring.style.left = dx + 'px';
        ring.style.top = dy + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state for interactive elements
    const hoverTargets = 'a, button, .btn, .project-card, .skill-card, .tilt-card, .hamburger, input, textarea';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.remove('hover');
        }
    });

    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        dot.style.display = 'none';
        ring.style.display = 'none';
    }
})();

// ─── THREE.JS SCENE SETUP ─────────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 20);

    // ─── LIGHTS ─────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2, 50);
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);

    // ─── STARDUST PARTICLES SETUP ─────
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        // Base positions in circular field
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.0 + Math.random() * 14;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 6;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Custom details for drift and physics
        particles.push({
            basePos: new THREE.Vector3(x, y, z),
            currPos: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(0, 0, 0),
            angle: angle,
            radius: radius,
            speed: 0.02 + Math.random() * 0.05,
            orbitSpeed: 0.0003 + Math.random() * 0.0006,
            noiseOffset: Math.random() * 100,
            size: 0.08 + Math.random() * 0.12
        });

        // Color gradient from cyan to magenta
        const color = new THREE.Color(0x00f0ff).lerp(new THREE.Color(0xff2d75), Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ─── MOUSE INTERACTION ─────
    let ndcMouse = new THREE.Vector2(-999, -999);
    let targetMouse = new THREE.Vector2(-999, -999);

    document.addEventListener('mousemove', (e) => {
        // Convert screen coordinates to Normalized Device Coordinates (-1 to 1)
        ndcMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener('mouseleave', () => {
        ndcMouse.set(-999, -999);
    });

    // ─── ANIMATION LOOP ─────
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const t = clock.getElapsedTime();

        // Smooth mouse position updates
        targetMouse.lerp(ndcMouse, 0.08);

        // Convert mouse to 3D coords based on viewport height/width at Z=0
        const vFOV = (camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const visibleWidth = visibleHeight * (window.innerWidth / window.innerHeight);

        const mouse3D = new THREE.Vector3(
            targetMouse.x * visibleWidth * 0.5,
            targetMouse.y * visibleHeight * 0.5,
            0
        );

        const posArray = particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];

            // 1. Idle Orbit Drift
            p.angle += p.orbitSpeed;
            const driftX = Math.cos(p.angle) * p.radius;
            const driftY = Math.sin(p.angle) * p.radius;

            const targetY = driftY + Math.sin(t * 0.5 + p.noiseOffset) * 0.5;
            p.basePos.x = driftX;
            p.basePos.y = targetY;

            // 2. Repel mouse interaction
            if (targetMouse.x !== -999) {
                const dx = p.currPos.x - mouse3D.x;
                const dy = p.currPos.y - mouse3D.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const repelDist = 4.0;
                if (dist < repelDist) {
                    const force = (repelDist - dist) / repelDist;
                    const dirX = dx / (dist || 1);
                    const dirY = dy / (dist || 1);

                    // Add acceleration away from mouse
                    p.velocity.x += dirX * force * 0.45;
                    p.velocity.y += dirY * force * 0.45;
                }
            }

            // 3. Return to base pos force
            const restoreX = (p.basePos.x - p.currPos.x) * 0.06;
            const restoreY = (p.basePos.y - p.currPos.y) * 0.06;
            p.velocity.x += restoreX;
            p.velocity.y += restoreY;

            // Apply friction
            p.velocity.x *= 0.85;
            p.velocity.y *= 0.85;

            // Update current position
            p.currPos.x += p.velocity.x;
            p.currPos.y += p.velocity.y;

            // Write back to geometry array
            posArray[i * 3] = p.currPos.x;
            posArray[i * 3 + 1] = p.currPos.y;
            posArray[i * 3 + 2] = p.currPos.z;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Render frame
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
    const words = ['Unreal Engine RPGs', 'Unity FPS Games', 'AI Behavior & Combat Logic', 'Enemy AI Systems', 'Narrative-Driven Worlds'];
    const el = document.getElementById('typewriter');
    if (!el) return;
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
    const MAX = 10;
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `perspective(800px) rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg) scale(1.02)`;
            card.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), ${dx * -6}px ${dy * -6}px 25px rgba(0,240,255,0.08)`;
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

// ─── NAVBAR SCROLL EFFECT + ACTIVE LINK + PROGRESS BAR ──────────────────────
(function () {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.hero, .section');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Darken navbar on scroll
        if (navbar) {
            navbar.style.background = window.scrollY > 60
                ? 'rgba(10, 10, 15, 0.96)' : 'rgba(10, 10, 15, 0.88)';
        }

        // Highlight active nav section
        let current = 'home';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });

        // Scroll progress bar
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    navLinks.forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // close mobile menu if open
            const navLinksMenu = document.getElementById('nav-links');
            if (navLinksMenu) navLinksMenu.classList.remove('open');
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
if (overlay) {
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// ─── GLITCH REVEAL SCROLL ANIMATION ─────────────────────────────────────────
(function () {
    const elements = document.querySelectorAll(
        '.skill-card, .project-card, .about-card, .about-text, .contact-card, .timeline-item'
    );

    elements.forEach((el, i) => {
        el.classList.add('glitch-reveal');
        el.style.transitionDelay = (i % 4) * 100 + 'ms';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.glitch-reveal').forEach(el => observer.observe(el));
})();

// ─── DYNAMIC SIDEBAR BUILDER FOR PROJECT PAGES ─────────────────────────────
(function () {
    const isProjPage = !!document.querySelector('.proj-hero');
    if (!isProjPage) return;

    // 1. Create layout grid and main column wrapper
    const grid = document.createElement('div');
    grid.className = 'proj-layout-grid';
    
    const mainCol = document.createElement('div');
    mainCol.className = 'proj-main-column';
    
    // Identify sections to move (all .proj-section tags)
    const sections = Array.from(document.querySelectorAll('.proj-section'));
    if (sections.length === 0) return;
    
    const parent = sections[0].parentNode;
    parent.insertBefore(grid, sections[0]);
    
    // Move sections into main column
    sections.forEach(sec => mainCol.appendChild(sec));
    grid.appendChild(mainCol);
    
    // 2. Create the sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'proj-sidebar';
    
    // Extract metadata from the hero banner
    const engineTag = document.querySelector('.proj-engine-tag')?.textContent || '';
    const awardBadge = document.querySelector('.proj-award-badge')?.innerHTML || '';
    const heroTags = document.querySelector('.proj-hero-tags')?.innerHTML || '';
    const heroActions = document.querySelector('.proj-hero-actions')?.innerHTML || '';
    
    let sidebarHTML = '';
    
    if (awardBadge) {
        sidebarHTML += `
            <div class="sidebar-item award-item">
                <span class="sidebar-label">◈ ACHIEVEMENT</span>
                <div class="sidebar-val">${awardBadge}</div>
            </div>
        `;
    }
    
    if (engineTag) {
        const parts = engineTag.split('·').map(p => p.trim());
        let metricsHTML = '';
        
        parts.forEach(part => {
            let label = 'Genre'; // default fallback
            let val = part;
            const lower = part.toLowerCase();
            
            if (lower.includes('unity') || lower.includes('unreal') || lower.includes('ue5')) {
                label = 'Engine';
            } else if (lower === 'c#' || lower === 'blueprints') {
                label = 'Scripting';
            } else if (lower === 'blender') {
                label = '3D Assets';
            } else if (lower === 'mixamo') {
                label = 'Animation';
            } else if (lower.includes('hours') || lower.includes('days') || lower.includes('weeks') || lower.includes('built in')) {
                label = 'Timeline';
            } else if (lower.includes('mobile') || lower.includes('android') || lower.includes('ios')) {
                label = 'Platform';
            }
            
            metricsHTML += `<div class="metric"><span class="m-lbl">${label}:</span><span class="m-val">${val}</span></div>`;
        });
        
        sidebarHTML += `
            <div class="sidebar-item">
                <span class="sidebar-label">◈ TACTICAL METRICS</span>
                <div class="metric-list">
                    ${metricsHTML}
                </div>
            </div>
        `;
    }
    
    if (heroTags) {
        sidebarHTML += `
            <div class="sidebar-item">
                <span class="sidebar-label">◈ EQUIPMENT LIST</span>
                <div class="sidebar-tags proj-hero-tags">${heroTags}</div>
            </div>
        `;
    }
    
    if (heroActions) {
        sidebarHTML += `
            <div class="sidebar-item">
                <span class="sidebar-label">◈ ACCESS PROTOCOL</span>
                <div class="sidebar-actions">${heroActions}</div>
            </div>
        `;
    }
    
    sidebar.innerHTML = sidebarHTML;
    grid.appendChild(sidebar);
})();
