/**
 * Main application controller for Misbah Bazina's portfolio.
 * Handles navigation, project rendering, skills graph, and scroll animations.
 */

/* =========================================================================
   Navigation
   ========================================================================= */

/** Initializes mobile hamburger menu toggle and nav link close behavior. */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* =========================================================================
   Projects
   ========================================================================= */

/**
 * Escapes HTML special characters to prevent XSS when injecting user data.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/**
 * Renders project sidebar cards from the global `projects` array
 * and sets up click/tap handlers for project selection.
 */
function renderProjects() {
    const sidebar = document.getElementById('projects-sidebar');
    if (!sidebar) return;

    if (typeof projects === 'undefined' || projects.length === 0) {
        sidebar.innerHTML = '<p class="projects-empty-msg">No projects uploaded yet.</p>';
        return;
    }

    sidebar.innerHTML = projects.map((project, index) => {
        const padIndex = String(index + 1).padStart(2, '0');
        return `
            <div class="project-select-item glass-panel${index === 0 ? ' active' : ''}" 
                 data-index="${index}"
                 role="button"
                 tabindex="0"
                 aria-pressed="${index === 0}">
                <div class="project-select-header">
                    <span class="project-select-index">PROJECT ${padIndex}</span>
                </div>
                <h3 class="project-select-name">${escapeHTML(project.name)}</h3>
                <p class="project-select-desc">${escapeHTML(project.description)}</p>
            </div>
        `;
    }).join('');

    const items = sidebar.querySelectorAll('.project-select-item');
    items.forEach(item => {
        const selectProject = () => {
            items.forEach(i => {
                i.classList.remove('active');
                i.setAttribute('aria-pressed', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-pressed', 'true');
            displayActiveProject(parseInt(item.dataset.index, 10));
        };

        item.addEventListener('click', selectProject);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectProject();
            }
        });
    });

    displayActiveProject(0);
}

/**
 * Updates the active project preview panel with the selected project's details.
 * @param {number} index - The index of the project in the projects array.
 */
function displayActiveProject(index) {
    const project = projects[index];
    if (!project) return;

    const titleEl = document.getElementById('active-project-title');
    const descEl = document.getElementById('active-project-desc');
    const tagsEl = document.getElementById('active-project-tags');
    const linkEl = document.getElementById('active-project-github');
    const canvasEl = document.getElementById('active-project-canvas');

    if (titleEl) titleEl.textContent = project.name;
    if (descEl) descEl.textContent = project.description;

    if (tagsEl) {
        tagsEl.innerHTML = (project.tags || []).map(
            tag => `<span class="project-tag-pill">${escapeHTML(tag)}</span>`
        ).join('');
    }

    if (linkEl) linkEl.href = project.githubUrl || '#';

    if (canvasEl) {
        if (project.imageUrl) {
            canvasEl.innerHTML = `<img src="${escapeHTML(project.imageUrl)}" alt="${escapeHTML(project.name)}" class="project-screen-img">`;
        } else {
            canvasEl.innerHTML = `
                <div class="screen-placeholder-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                    <span class="screen-placeholder-text">Project Canvas</span>
                    <span class="screen-placeholder-sub">Screenshot Empty</span>
                </div>
            `;
        }
    }
}

/* =========================================================================
   Certificates
   ========================================================================= */

/**
 * Renders certificate cards from the global `certificates` array.
 */
function renderCertificates() {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    if (typeof certificates === 'undefined' || certificates.length === 0) {
        grid.innerHTML = '<p class="projects-empty-msg" style="grid-column: 1 / -1; text-align: center;">No certificates uploaded yet.</p>';
        return;
    }

    grid.innerHTML = certificates.map(cert => {
        const mediaHtml = cert.imageUrl 
            ? `<img src="${escapeHTML(cert.imageUrl)}" alt="${escapeHTML(cert.name)}" class="cert-image">`
            : `<span class="cert-placeholder-tag">Image Empty</span>`;

        return `
            <article class="certificate-card glass-panel">
                <div class="cert-card-top">
                    <span class="cert-badge">${escapeHTML(cert.badge)}</span>
                    <h3 class="cert-name">${escapeHTML(cert.name)}</h3>
                    <p class="cert-issuer">${escapeHTML(cert.issuer)}</p>
                </div>
                <div class="cert-footer">
                    ${mediaHtml}
                    <a href="${escapeHTML(cert.credentialUrl || '#')}" target="_blank" rel="noopener noreferrer" class="cert-link" aria-label="Verify credential for ${escapeHTML(cert.name)}">
                        <span>Verify Credential</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }).join('');
}

/* =========================================================================
   Skills Graph
   ========================================================================= */

/** Initializes the interactive SVG skills network with hover and tap support. */
function initSkillsGraph() {
    const nodes = document.querySelectorAll('.skill-node');
    const titleEl = document.getElementById('skill-title');
    const descEl = document.getElementById('skill-desc');
    const progressEl = document.getElementById('skill-progress');
    const levelEl = document.getElementById('skill-level');

    if (!titleEl || !descEl || !progressEl || !levelEl) return;

    nodes.forEach(node => {
        const activate = () => {
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const name = node.dataset.skill;
            const level = node.dataset.level;
            const desc = node.dataset.desc;

            titleEl.textContent = name;
            descEl.textContent = desc;
            progressEl.style.width = `${level}%`;
            levelEl.textContent = `Level: ${(parseFloat(level) / 10).toFixed(1)}/10`;
        };

        node.addEventListener('mouseenter', activate);
        node.addEventListener('click', activate);
    });

    // Initialize with the default active node
    const defaultNode = document.querySelector('.skill-node.active');
    if (defaultNode) {
        defaultNode.dispatchEvent(new Event('mouseenter'));
    }
}

/* =========================================================================
   Scroll Reveal Animations
   ========================================================================= */

/** Sets up IntersectionObserver to trigger reveal animations on scroll. */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
}

/* =========================================================================
   CV Download
   ========================================================================= */

/**
 * Initializes the CV download button behavior.
 * Intercepts clicks if the href is a placeholder so it doesn't refresh the page.
 */
function initCVDownload() {
    const cvBtn = document.getElementById('cv-download-btn');
    if (!cvBtn) return;

    cvBtn.addEventListener('click', (e) => {
        const href = cvBtn.getAttribute('href');
        if (!href || href === '#' || href === '' || href.toLowerCase().includes('placeholder')) {
            e.preventDefault();
            alert('My CV is currently being updated and is not yet available for download. Please check back soon!');
        }
    });
}

/* =========================================================================
   Initialization
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderProjects();
    renderCertificates();
    initSkillsGraph();
    initCVDownload();
    // Delay scroll animations to ensure dynamically rendered content is in the DOM
    requestAnimationFrame(() => {
        requestAnimationFrame(initScrollAnimations);
    });
});
