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
    // ─── CANVAS LOGO TEXTURE GENERATORS ─────
    function createUnityTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 256, 256);
        
        // Setup glow styling
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const cx = 128;
        const cy = 128;
        const s = 65; // side length
        
        // 3D isometric cube outline
        // Draw inner spokes from center to three vertices
        ctx.beginPath();
        // Spoke to top
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - s);
        // Spoke to bottom-left
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - s * 0.866, cy + s * 0.5);
        // Spoke to bottom-right
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + s * 0.866, cy + s * 0.5);
        ctx.stroke();
        
        // Draw outer hexagon contour
        ctx.beginPath();
        ctx.moveTo(cx, cy - s); // top
        ctx.lineTo(cx + s * 0.866, cy - s * 0.5); // top-right
        ctx.lineTo(cx + s * 0.866, cy + s * 0.5); // bottom-right
        ctx.lineTo(cx, cy + s); // bottom
        ctx.lineTo(cx - s * 0.866, cy + s * 0.5); // bottom-left
        ctx.lineTo(cx - s * 0.866, cy - s * 0.5); // top-left
        ctx.closePath();
        ctx.stroke();
        
        return new THREE.CanvasTexture(canvas);
    }

    function createUnrealTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 256, 256);
        
        // Setup glow styling
        ctx.shadowColor = '#ff2d75';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ff2d75';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const cx = 128;
        const cy = 128;
        
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(cx, cy, 90, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw stylized 'U'
        ctx.beginPath();
        ctx.lineWidth = 14;
        
        // Outer curve of U
        ctx.moveTo(90, 75);
        ctx.lineTo(90, 130);
        ctx.bezierCurveTo(90, 185, 166, 185, 166, 130);
        ctx.lineTo(166, 75);
        ctx.stroke();
        
        // Top outward-pointing ticks/serifs
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.moveTo(90, 75);
        ctx.lineTo(75, 75);
        ctx.moveTo(166, 75);
        ctx.lineTo(181, 75);
        ctx.stroke();
        
        return new THREE.CanvasTexture(canvas);
    }

    // ─── HERO 3D OBJECTS: Floating Unity/Unreal Bubbles ─────
    const hasHero = !!document.querySelector('.hero');
    const bubbleFieldGroup = new THREE.Group();
    const bubbles = [];
    
    if (hasHero) {
        const unityTex = createUnityTexture();
        const unrealTex = createUnrealTexture();
        
        const bubbleCount = 14;
        
        // Geometries
        const sphereGeo = new THREE.SphereGeometry(0.55, 20, 20);
        const logoGeo = new THREE.PlaneGeometry(0.7, 0.7);
        
        for (let i = 0; i < bubbleCount; i++) {
            const isUnity = i % 2 === 0;
            const tex = isUnity ? unityTex : unrealTex;
            
            // Outer glass bubble shell
            const shellMat = new THREE.MeshPhongMaterial({
                color: isUnity ? 0x00f0ff : 0xff2d75,
                emissive: isUnity ? 0x00f0ff : 0xff2d75,
                emissiveIntensity: 0.15,
                specular: 0xffffff,
                shininess: 90,
                transparent: true,
                opacity: 0.12,
                depthWrite: false
            });
            const shell = new THREE.Mesh(sphereGeo, shellMat);
            
            // Inner logo plane
            const logoMat = new THREE.MeshBasicMaterial({
                map: tex,
                transparent: true,
                opacity: 0.45,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const logo = new THREE.Mesh(logoGeo, logoMat);
            
            // Group them
            const group = new THREE.Group();
            group.add(shell);
            group.add(logo);
            
            // Random positioning across screen dynamically based on camera frustum
            const aspect = window.innerWidth / window.innerHeight;
            const frustumHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
            const frustumWidth = frustumHeight * aspect;
            
            group.position.set(
                (Math.random() - 0.5) * frustumWidth * 1.5,
                (Math.random() - 0.5) * frustumHeight * 1.5,
                (Math.random() - 0.5) * 8 - 2
            );
            
            // Random scaling
            const scale = 0.8 + Math.random() * 0.7;
            group.scale.set(scale, scale, scale);
            
            // Random velocities
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.007,
                (Math.random() - 0.5) * 0.007,
                (Math.random() - 0.5) * 0.003
            );
            
            // Random rotation speed for the logo plane inside
            const rotSpeed = (Math.random() - 0.5) * 0.012;
            const phase = Math.random() * Math.PI * 2;
            
            bubbleFieldGroup.add(group);
            bubbles.push({
                group,
                shellMat,
                logoMat,
                logo,
                velocity,
                rotSpeed,
                phase
            });
        }
        
        scene.add(bubbleFieldGroup);
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
        // 1. Update Floating Bubbles (Drift, rotate, hover, fade near center)
        const isMobile = window.innerWidth < 992;
        if (hasHero && bubbleFieldGroup) {
            // Scroll parallax for the entire field of bubbles
            const scrollFactor = isMobile ? 0.008 : 0.015;
            bubbleFieldGroup.position.y = -scrollY * scrollFactor;
            
            bubbles.forEach((bubble) => {
                // Update position via velocity
                bubble.group.position.add(bubble.velocity);
                
                // Slowly rotate the inner logo plane
                bubble.logo.rotation.y += bubble.rotSpeed;
                bubble.logo.rotation.x += bubble.rotSpeed * 0.5;
                
                // Hover oscillation
                bubble.group.position.y += Math.sin(t * 0.6 + bubble.phase) * 0.002;
                
                // Viewport boundary collision bouncing dynamically based on camera frustum
                const aspect = window.innerWidth / window.innerHeight;
                const frustumHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
                const frustumWidth = frustumHeight * aspect;
                
                const boundX = frustumWidth / 2 + 1.0;
                const boundY = frustumHeight / 2 + 1.0;
                
                if (Math.abs(bubble.group.position.x) > boundX) {
                    bubble.velocity.x *= -1;
                    // Push slightly back to prevent sticky edges
                    bubble.group.position.x = Math.sign(bubble.group.position.x) * boundX;
                }
                if (Math.abs(bubble.group.position.y) > boundY) {
                    bubble.velocity.y *= -1;
                    bubble.group.position.y = Math.sign(bubble.group.position.y) * boundY;
                }
                if (bubble.group.position.z < -10 || bubble.group.position.z > 6) {
                    bubble.velocity.z *= -1;
                }
                
                // Elliptical exclusion zone fading (so bubbles dissolve near main text)
                // Center text area approx: width 9 units, height 6 units in 3D scene coordinate space
                const rx = isMobile ? 5.5 : 8.5;
                const ry = isMobile ? 7.5 : 5.0;
                
                const normX = bubble.group.position.x / rx;
                const normY = bubble.group.position.y / ry;
                const dist = Math.sqrt(normX * normX + normY * normY);
                
                let opacityFactor = 1.0;
                if (dist < 1.0) {
                    // Smoothly fade from 0 (at center) to 1 (at outer boundary)
                    opacityFactor = THREE.MathUtils.smoothstep(dist, 0.15, 1.0);
                }
                
                // Apply the opacity factor to the materials
                bubble.shellMat.opacity = 0.12 * opacityFactor;
                bubble.logoMat.opacity = 0.45 * opacityFactor;
            });
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
