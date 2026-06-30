// ─── portfolio.js — renders all sections from PortfolioData ──────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await PortfolioData.getAsync();
  renderAll();
  initNav();
  initScrollReveal();
  initSkillBars();
  initFilterTabs();

  // Re-renderizar si cambian los datos desde el panel admin
  PortfolioData.subscribe(() => renderAll());
});

function renderAll() {
  const d = PortfolioData.get();
  renderHero(d);
  renderAbout(d);
  renderResume(d);
  renderPortfolio(d);
  renderFooter(d);
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function initNav() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('[data-section]');
  const links = document.querySelectorAll('.nav-links a');

  // Phone
  const d = PortfolioData.get();
  document.getElementById('nav-phone').textContent = d.personal.phone;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.dataset.section;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function renderHero(d) {
  document.getElementById('hero-first').textContent = d.personal.firstName;
  document.getElementById('hero-last').textContent  = d.personal.lastName;
  document.getElementById('hero-title').textContent = d.personal.title;

  // Socials
  const socialIcons = {
    behance:     'bi bi-behance',
    facebook:    'bi bi-facebook',
    linkedin:    'bi bi-linkedin',
    instagram:   'bi bi-instagram',
    pinterest:   'bi bi-pinterest',
    'twitter-x': 'bi bi-twitter-x',
    whatsapp:    'bi bi-whatsapp',
    github:      'bi bi-github',
    youtube:     'bi bi-youtube',
    tiktok:      'bi bi-tiktok',
    dribbble:    'bi bi-dribbble',
  };
  const container = document.getElementById('hero-socials');
  container.innerHTML = d.socials.map(s => `
    <a href="${s.url}" title="${s.name}" target="_blank">
      <i class="${socialIcons[s.icon] || 'bi bi-link'}"></i>
    </a>
  `).join('');
}

// ── About ─────────────────────────────────────────────────────────────────────
function renderAbout(d) {
  document.getElementById('about-photo').src = d.personal.photo;
  document.getElementById('about-email').textContent = d.personal.email;
  document.getElementById('about-bio').textContent = d.personal.bio;
  document.getElementById('about-location').innerHTML =
    `<i class="bi bi-geo-alt"></i> ${d.personal.location} — ${d.personal.address}`;
}

// ── Resume ────────────────────────────────────────────────────────────────────
function renderResume(d) {
  // Software skills
  document.getElementById('software-skills').innerHTML = d.softwareSkills.map(s => `
    <div class="skill-item">
      <div class="skill-label"><span>${s.name}</span><span>${s.percent}%</span></div>
      <div class="skill-track"><div class="skill-fill" data-pct="${s.percent}"><div class="skill-dot"></div></div></div>
    </div>
  `).join('');

  // Languages
  document.getElementById('language-skills').innerHTML = d.languages.map(l => `
    <div class="skill-item">
      <div class="skill-label"><span>${l.name}</span><span>${l.percent}%</span></div>
      <div class="skill-track"><div class="skill-fill" data-pct="${l.percent}"><div class="skill-dot"></div></div></div>
    </div>
  `).join('');

  // Personal skills
  document.getElementById('personal-skills').innerHTML = d.personalSkills
    .map(s => `<li>${s}</li>`).join('');

  // Experience
  document.getElementById('experience-list').innerHTML = d.experience.map(exp => `
    <div class="exp-item">
      <div class="exp-icon" style="background:${exp.color}22; color:${exp.color}; border:1px solid ${exp.color}44;">
        ${exp.company.substring(0,2).toUpperCase()}
      </div>
      <div class="exp-body">
        <div class="exp-company">${exp.company}</div>
        <div class="exp-role">${exp.role}</div>
        <div class="exp-period">${exp.period}</div>
      </div>
    </div>
  `).join('');

  // Education
  document.getElementById('education-list').innerHTML = d.education.map(e => `
    <div class="edu-item">
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-institution">${e.institution}</div>
      <div class="edu-year">${e.year}</div>
    </div>
  `).join('');

  // What can I do
  document.getElementById('what-can-i-do').innerHTML = d.whatCanIDo
    .map(s => `<li>${s}</li>`).join('');

  // Design skills
  document.getElementById('design-skills').innerHTML = d.designSkills
    .map(s => `<li>${s}</li>`).join('');

  // Hobbies
  const hobbyIcons = {
    'book-open': 'bi bi-book',
    'camera':    'bi bi-camera',
    'pen-tool':  'bi bi-pen',
    'map-pin':   'bi bi-geo',
    'music':     'bi bi-music-note',
    'film':      'bi bi-joystick',
    'code':      'bi bi-code-slash',
    'heart':     'bi bi-heart',
    'star':      'bi bi-shield-shaded',
    'sun':       'bi bi-sun',
  };
  document.getElementById('hobbies-grid').innerHTML = d.hobbies.map(h => `
    <div class="hobby-item">
      <i class="${hobbyIcons[h.icon] || 'bi bi-star'}"></i>
      <span>${h.name}</span>
    </div>
  `).join('');
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
function renderPortfolio(d) {
  const placeholders = ['BD', 'MG', 'PP', 'MX', 'SC', 'AR'];
  const gradients = [
    'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
    'linear-gradient(135deg,#0d1117,#161b22,#21262d)',
    'linear-gradient(135deg,#0a0015,#150020,#1f0030)',
    'linear-gradient(135deg,#001a1a,#002a2a,#003a3a)',
    'linear-gradient(135deg,#1a0a00,#2a1500,#3a2000)',
    'linear-gradient(135deg,#000d1a,#001a33,#00264d)',
  ];

  const container = document.getElementById('projects-grid');
  container.innerHTML = d.projects.map((p, i) => `
    <div class="project-card reveal" data-category="${p.category}" data-delay="${i * 80}">
      <div class="project-thumb" style="background:${gradients[i % gradients.length]}">
        ${p.image ? `<img src="${p.image}" alt="${p.title}">` : `<div class="project-thumb-placeholder">${placeholders[i % placeholders.length]}</div>`}
        <div class="project-overlay"><i class="bi bi-eye"></i></div>
      </div>
      <div class="project-info">
        <div class="project-category">${p.category}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');

  // Re-trigger scroll reveal for newly created cards
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      if (isInView(el)) el.classList.add('visible');
    });
    initScrollReveal();
  }, 50);
}

// ── Footer ────────────────────────────────────────────────────────────────────
function renderFooter(d) {
  document.getElementById('footer-name').textContent =
    `${d.personal.firstName} ${d.personal.lastName}`;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ── Skill Bars Animation ──────────────────────────────────────────────────────
function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const resumeSection = document.getElementById('resume');
  if (resumeSection) observer.observe(resumeSection);
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
function isInView(el) {
  return el.getBoundingClientRect().top < window.innerHeight - 60;
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const check = () => {
    revealEls.forEach((el, i) => {
      if (isInView(el)) {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  };
  window.addEventListener('scroll', check, { passive: true });
  check();
}

// ── Filter Tabs ───────────────────────────────────────────────────────────────
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'All' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}
