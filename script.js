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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // ─── LIGHTS ─────
    const ambientLight = new THREE.AmbientLight(0x00f0ff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 2.5, 60);
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff2d75, 2.0, 60);
    pointLight2.position.set(-12, -8, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa855f7, 1.5, 40);
    pointLight3.position.set(0, -14, 8);
    scene.add(pointLight3);

    // ─── HERO 3D OBJECT: Holographic Gamepad (game-themed) ─────
    const hasHero = !!document.querySelector('.hero');
    const gamepadGroup = new THREE.Group();

    if (hasHero) {
        // Controller main body
        const bodyGeo = new THREE.BoxGeometry(4.6, 2.8, 1.2);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x050508, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.7
        });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        gamepadGroup.add(bodyMesh);

        const bodyWireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.35 });
        const bodyWire = new THREE.Mesh(bodyGeo, bodyWireMat);
        gamepadGroup.add(bodyWire);

        // Left Grip
        const gripGeo = new THREE.CylinderGeometry(0.75, 0.5, 3.2, 8);
        const leftGrip = new THREE.Mesh(gripGeo, bodyMat);
        leftGrip.position.set(-2.3, -1.2, 0);
        leftGrip.rotation.z = Math.PI / 5.5; // angle left grip
        gamepadGroup.add(leftGrip);

        const leftGripWire = new THREE.Mesh(gripGeo, bodyWireMat);
        leftGripWire.position.copy(leftGrip.position);
        leftGripWire.rotation.copy(leftGrip.rotation);
        gamepadGroup.add(leftGripWire);

        // Right Grip
        const rightGrip = new THREE.Mesh(gripGeo, bodyMat);
        rightGrip.position.set(2.3, -1.2, 0);
        rightGrip.rotation.z = -Math.PI / 5.5; // angle right grip
        gamepadGroup.add(rightGrip);

        const rightGripWire = new THREE.Mesh(gripGeo, bodyWireMat);
        rightGripWire.position.copy(rightGrip.position);
        rightGripWire.rotation.copy(rightGrip.rotation);
        gamepadGroup.add(rightGripWire);

        // Thumbsticks (two cylinders)
        const stickGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 8);
        const stickMat = new THREE.MeshStandardMaterial({ color: 0xff2d75, emissive: 0xff2d75, emissiveIntensity: 0.2, metalness: 0.9, roughness: 0.1 });
        const stickWireMat = new THREE.MeshBasicMaterial({ color: 0xff2d75, wireframe: true });

        const leftStick = new THREE.Mesh(stickGeo, stickMat);
        leftStick.position.set(-1.0, -0.2, 0.7);
        leftStick.rotation.x = Math.PI / 2;
        gamepadGroup.add(leftStick);

        const leftStickWire = new THREE.Mesh(stickGeo, stickWireMat);
        leftStickWire.position.copy(leftStick.position);
        leftStickWire.rotation.copy(leftStick.rotation);
        gamepadGroup.add(leftStickWire);

        const rightStick = new THREE.Mesh(stickGeo, stickMat);
        rightStick.position.set(1.0, -0.2, 0.7);
        rightStick.rotation.x = Math.PI / 2;
        gamepadGroup.add(rightStick);

        const rightStickWire = new THREE.Mesh(stickGeo, stickWireMat);
        rightStickWire.position.copy(rightStick.position);
        rightStickWire.rotation.copy(rightStick.rotation);
        gamepadGroup.add(rightStickWire);

        // D-Pad (cross shape)
        const dpadHorizGeo = new THREE.BoxGeometry(1.2, 0.4, 0.3);
        const dpadVertGeo = new THREE.BoxGeometry(0.4, 1.2, 0.3);
        const dpadMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.4 });
        const dpadWireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });

        const dpadH = new THREE.Mesh(dpadHorizGeo, dpadMat);
        dpadH.position.set(-1.9, 0.5, 0.7);
        gamepadGroup.add(dpadH);

        const dpadHW = new THREE.Mesh(dpadHorizGeo, dpadWireMat);
        dpadHW.position.copy(dpadH.position);
        gamepadGroup.add(dpadHW);

        const dpadV = new THREE.Mesh(dpadVertGeo, dpadMat);
        dpadV.position.set(-1.9, 0.5, 0.7);
        gamepadGroup.add(dpadV);

        const dpadVW = new THREE.Mesh(dpadVertGeo, dpadWireMat);
        dpadVW.position.copy(dpadV.position);
        gamepadGroup.add(dpadVW);

        // Action Buttons (4 small spheres in diamond layout)
        const btnGeo = new THREE.SphereGeometry(0.24, 6, 6);
        const btnMatY = new THREE.MeshStandardMaterial({ color: 0xff2d75, emissive: 0xff2d75, emissiveIntensity: 0.8 }); // Y (top) - Magenta
        const btnMatB = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 }); // B (right) - Cyan
        const btnMatA = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.8 }); // A (bottom) - Green
        const btnMatX = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.8 }); // X (left) - Gold

        const btnY = new THREE.Mesh(btnGeo, btnMatY); btnY.position.set(1.9, 0.8, 0.7); gamepadGroup.add(btnY);
        const btnA = new THREE.Mesh(btnGeo, btnMatA); btnA.position.set(1.9, 0.2, 0.7); gamepadGroup.add(btnA);
        const btnX = new THREE.Mesh(btnGeo, btnMatX); btnX.position.set(1.6, 0.5, 0.7); gamepadGroup.add(btnX);
        const btnB = new THREE.Mesh(btnGeo, btnMatB); btnB.position.set(2.2, 0.5, 0.7); gamepadGroup.add(btnB);

        scene.add(gamepadGroup);
    }

    // ─── CONSTELLATION NODE NETWORK ─────
    const maxParticles = 90;
    const minDistance = 5.5;
    const particlePositions = new Float32Array(maxParticles * 3);
    const particleData = [];

    // Initialize particles inside a 3D box
    for (let i = 0; i < maxParticles; i++) {
        // distribute particles across the visible space
        const x = (Math.random() - 0.5) * 45;
        const y = (Math.random() - 0.5) * 35;
        const z = (Math.random() - 0.5) * 16 - 3;
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        particleData.push({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.01
            )
        });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom points material
    const particleMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.16,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Connection lines
    const maxConnections = maxParticles * 8;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // ─── MOUSE PARALLAX & SCROLL ─────
    let mouseX = 0, mouseY = 0;
    let scrollY = window.scrollY;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // ─── ANIMATION LOOP ─────
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // 1. Responsive placement & Scroll offset of the Gamepad
        const isMobile = window.innerWidth < 992;
        const targetX = isMobile ? 0 : 7;
        const crystalScrollFactor = isMobile ? 0.015 : 0.024;

        if (hasHero && gamepadGroup) {
            gamepadGroup.position.x = targetX;

            // Floating hover motion
            const currentY = (isMobile ? -2.2 : 0) - scrollY * crystalScrollFactor;
            gamepadGroup.position.y = currentY + Math.sin(t * 1.5) * 0.3;

            // 2. Gamepad Rotation
            gamepadGroup.rotation.y = t * 0.35;
            gamepadGroup.rotation.x = Math.sin(t * 0.5) * 0.18;
            gamepadGroup.rotation.z = Math.cos(t * 0.5) * 0.08;
        }

        // 3. Update Constellation Nodes (Particles)
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let i = 0; i < maxParticles; i++) {
            // Update node positions
            particlePositions[i * 3] += particleData[i].velocity.x;
            particlePositions[i * 3 + 1] += particleData[i].velocity.y;
            particlePositions[i * 3 + 2] += particleData[i].velocity.z;

            // Bounce boundary checks
            if (particlePositions[i * 3] < -25 || particlePositions[i * 3] > 25) particleData[i].velocity.x *= -1;
            if (particlePositions[i * 3 + 1] < -20 || particlePositions[i * 3 + 1] > 20) particleData[i].velocity.y *= -1;
            if (particlePositions[i * 3 + 2] < -12 || particlePositions[i * 3 + 2] > 10) particleData[i].velocity.z *= -1;

            // Draw connection lines to nearby nodes
            for (let j = i + 1; j < maxParticles; j++) {
                const dx = particlePositions[i * 3] - particlePositions[j * 3];
                const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < minDistance && numConnected < maxConnections) {
                    // Line endpoint 1
                    linePositions[vertexpos++] = particlePositions[i * 3];
                    linePositions[vertexpos++] = particlePositions[i * 3 + 1];
                    linePositions[vertexpos++] = particlePositions[i * 3 + 2];

                    // Line endpoint 2
                    linePositions[vertexpos++] = particlePositions[j * 3];
                    linePositions[vertexpos++] = particlePositions[j * 3 + 1];
                    linePositions[vertexpos++] = particlePositions[j * 3 + 2];

                    // Lerp color and fade by distance
                    const alpha = 1.0 - (dist / minDistance);
                    const color = new THREE.Color(0x00f0ff).lerp(new THREE.Color(0xff2d75), i / maxParticles);

                    lineColors[colorpos++] = color.r * alpha * 0.3;
                    lineColors[colorpos++] = color.g * alpha * 0.3;
                    lineColors[colorpos++] = color.b * alpha * 0.3;

                    lineColors[colorpos++] = color.r * alpha * 0.3;
                    lineColors[colorpos++] = color.g * alpha * 0.3;
                    lineColors[colorpos++] = color.b * alpha * 0.3;

                    numConnected++;
                }
            }
        }

        particlePoints.geometry.attributes.position.needsUpdate = true;
        lineSegments.geometry.setDrawRange(0, numConnected * 2);
        lineSegments.geometry.attributes.position.needsUpdate = true;
        lineSegments.geometry.attributes.color.needsUpdate = true;

        // 4. Parallax Camera motion
        camera.position.x += (mouseX * 1.8 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 1.0 - camera.position.y) * 0.03;
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
    
    sidebar.innerHTML = `
        <div class="card-glow"></div>
        <div class="sidebar-inner">
            ${sidebarHTML}
        </div>
    `;
    
    grid.appendChild(sidebar);
})();
