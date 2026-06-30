// ─── admin.js — Full CRUD Admin Panel Logic ───────────────────────────────────

// Auth guard
if (!PortfolioData.isLoggedIn()) {
  window.location.href = 'login.html';
}

// ── Globals ───────────────────────────────────────────────────────────────────
let currentPanel = 'dashboard';

// ── Navigation ────────────────────────────────────────────────────────────────
function switchPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`panel-${name}`)?.classList.add('active');
  document.getElementById(`nav-${name}`)?.classList.add('active');
  document.getElementById('topbar-title').textContent = {
    dashboard:  'Dashboard',
    personal:   'Información Personal',
    skills:     'Habilidades',
    experience: 'Experiencia Laboral',
    education:  'Educación',
    projects:   'Proyectos',
    socials:    'Redes Sociales',
    security:   'Seguridad',
  }[name] || name;
  currentPanel = name;
  loadPanel(name);
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => switchPanel(item.dataset.panel));
});

// ── Logout ────────────────────────────────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', () => {
  PortfolioData.setLoggedIn(false);
  window.location.href = 'login.html';
});

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <i class="bi ${type === 'success' ? 'bi-check-circle-fill success-icon' : 'bi-x-circle-fill error-icon'}"></i>
    <span>${msg}</span>
  `;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Load Panel ────────────────────────────────────────────────────────────────
function loadPanel(name) {
  const d = PortfolioData.get();
  switch (name) {
    case 'dashboard':  loadDashboard(d); break;
    case 'personal':   loadPersonal(d);  break;
    case 'skills':     loadSkills(d);    break;
    case 'experience': loadExperience(d);break;
    case 'education':  loadEducation(d); break;
    case 'projects':   loadProjects(d);  break;
    case 'socials':    loadSocials(d);   break;
    case 'security':   loadSecurity(d);  break;
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function loadDashboard(d) {
  const stats = [
    { label:'Proyectos',    value: d.projects.length,       icon:'bi-images',       cls:'blue' },
    { label:'Habilidades',  value: d.softwareSkills.length + d.languages.length, icon:'bi-bar-chart-line', cls:'green' },
    { label:'Experiencias', value: d.experience.length,     icon:'bi-briefcase',    cls:'orange' },
    { label:'Redes',        value: d.socials.length,        icon:'bi-share',        cls:'red' },
  ];
  document.getElementById('stats-row').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon ${s.cls}"><i class="bi ${s.icon}"></i></div>
      <div>
        <div class="stat-num">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    </div>
  `).join('');
  document.getElementById('last-modified').textContent = new Date().toLocaleDateString('es', { day:'2-digit', month:'short', year:'numeric' });
  document.getElementById('topbar-user').innerHTML = `<i class="bi bi-person"></i> ${PortfolioData.getAuth().username}`;
}

// ── Personal ──────────────────────────────────────────────────────────────────
function loadPersonal(d) {
  const p = d.personal;
  document.getElementById('field-photo').value        = p.photo || '';
  document.getElementById('field-firstName').value    = p.firstName || '';
  document.getElementById('field-lastName').value     = p.lastName || '';
  document.getElementById('field-title').value        = p.title || '';
  document.getElementById('field-phone').value        = p.phone || '';
  document.getElementById('field-email').value        = p.email || '';
  document.getElementById('field-location').value     = p.location || '';
  document.getElementById('field-address').value      = p.address || '';
  document.getElementById('field-bio').value          = p.bio || '';
  document.getElementById('field-whatcando').value    = (d.whatCanIDo || []).join('\n');
  document.getElementById('field-designskills').value = (d.designSkills || []).join('\n');
  document.getElementById('field-personalskills').value = (d.personalSkills || []).join(', ');
  document.getElementById('photo-preview').src        = p.photo || 'profile.png';

  // Photo preview update
  document.getElementById('field-photo').addEventListener('input', function() {
    document.getElementById('photo-preview').src = this.value || 'profile.png';
  });

  // Hobbies
  renderHobbiesList(d.hobbies || []);
}

function renderHobbiesList(hobbies) {
  const iconOptions = ['book-open','camera','pen-tool','map-pin','music','film','code','heart','star','sun'];
  document.getElementById('hobbies-list').innerHTML = hobbies.map((h, i) => `
    <div class="list-item" id="hobby-${i}">
      <div class="list-item-info">
        <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:0.5rem;">
          <div>
            <label class="admin-label">Nombre</label>
            <input class="admin-input hobby-name" value="${h.name}" data-i="${i}">
          </div>
          <div>
            <label class="admin-label">Ícono</label>
            <select class="admin-select hobby-icon" data-i="${i}">
              ${iconOptions.map(ic => `<option value="${ic}" ${h.icon===ic?'selected':''}>${ic}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="list-item-actions">
        <button class="btn-icon del" onclick="removeHobby(${i})"><i class="bi bi-trash3"></i></button>
      </div>
    </div>
  `).join('');
}

window.removeHobby = function(i) {
  const d = PortfolioData.get();
  d.hobbies.splice(i, 1);
  renderHobbiesList(d.hobbies);
};

document.getElementById('add-hobby').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.hobbies.push({ name: 'Nuevo Hobby', icon: 'star' });
  renderHobbiesList(d.hobbies);
});

document.getElementById('save-personal').addEventListener('click', () => {
  const d = PortfolioData.get();

  d.personal.photo     = document.getElementById('field-photo').value.trim();
  d.personal.firstName = document.getElementById('field-firstName').value.trim();
  d.personal.lastName  = document.getElementById('field-lastName').value.trim();
  d.personal.title     = document.getElementById('field-title').value.trim();
  d.personal.phone     = document.getElementById('field-phone').value.trim();
  d.personal.email     = document.getElementById('field-email').value.trim();
  d.personal.location  = document.getElementById('field-location').value.trim();
  d.personal.address   = document.getElementById('field-address').value.trim();
  d.personal.bio       = document.getElementById('field-bio').value.trim();

  d.whatCanIDo    = document.getElementById('field-whatcando').value.split('\n').map(s=>s.trim()).filter(Boolean);
  d.designSkills  = document.getElementById('field-designskills').value.split('\n').map(s=>s.trim()).filter(Boolean);
  d.personalSkills= document.getElementById('field-personalskills').value.split(',').map(s=>s.trim()).filter(Boolean);

  // Collect hobbies
  d.hobbies = [];
  document.querySelectorAll('.hobby-name').forEach((el, i) => {
    const icon = document.querySelectorAll('.hobby-icon')[i]?.value || 'star';
    d.hobbies.push({ name: el.value.trim(), icon });
  });

  PortfolioData.save(d);
  toast('¡Información personal guardada!');
});

// ── Skills ────────────────────────────────────────────────────────────────────
function loadSkills(d) {
  renderSkillList('software-skills-list', d.softwareSkills);
  renderSkillList('language-skills-list', d.languages);
}

function renderSkillList(containerId, list) {
  document.getElementById(containerId).innerHTML = list.map((s, i) => `
    <div class="list-item">
      <div class="list-item-info">
        <div class="form-grid" style="grid-template-columns:1fr auto 80px;gap:0.5rem;align-items:end;">
          <div>
            <label class="admin-label">Nombre</label>
            <input class="admin-input skill-name-${containerId}" value="${s.name}" data-i="${i}">
          </div>
          <div>
            <label class="admin-label">Porcentaje</label>
            <div class="range-wrap">
              <input type="range" class="admin-range skill-pct-${containerId}" min="0" max="100" value="${s.percent}" data-i="${i}"
                oninput="this.nextElementSibling.textContent=this.value+'%'">
              <span class="range-val">${s.percent}%</span>
            </div>
          </div>
        </div>
      </div>
      <button class="btn-icon del" onclick="removeSkill('${containerId}', ${i})"><i class="bi bi-trash3"></i></button>
    </div>
  `).join('');
}

window.removeSkill = function(containerId, i) {
  const d = PortfolioData.get();
  const key = containerId === 'software-skills-list' ? 'softwareSkills' : 'languages';
  d[key].splice(i, 1);
  renderSkillList(containerId, d[key]);
};

document.getElementById('add-software-skill').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.softwareSkills.push({ name: 'Nueva Habilidad', percent: 50 });
  renderSkillList('software-skills-list', d.softwareSkills);
});
document.getElementById('add-language-skill').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.languages.push({ name: 'Nuevo Idioma', percent: 50 });
  renderSkillList('language-skills-list', d.languages);
});

document.getElementById('save-skills').addEventListener('click', () => {
  const d = PortfolioData.get();

  d.softwareSkills = [...document.querySelectorAll('.skill-name-software-skills-list')].map((el, i) => ({
    name: el.value.trim(),
    percent: parseInt(document.querySelectorAll('.skill-pct-software-skills-list')[i]?.value || 50),
  }));
  d.languages = [...document.querySelectorAll('.skill-name-language-skills-list')].map((el, i) => ({
    name: el.value.trim(),
    percent: parseInt(document.querySelectorAll('.skill-pct-language-skills-list')[i]?.value || 50),
  }));

  PortfolioData.save(d);
  toast('¡Habilidades guardadas!');
});

// ── Experience ────────────────────────────────────────────────────────────────
function loadExperience(d) {
  renderExperienceList(d.experience);
}

function renderExperienceList(list) {
  document.getElementById('experience-list-admin').innerHTML = list.map((exp, i) => `
    <div class="list-item" style="flex-direction:column;align-items:stretch;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <strong style="font-size:0.82rem;">#${i+1} — ${exp.company || 'Nueva empresa'}</strong>
        <button class="btn-icon del" onclick="removeExp(${i})"><i class="bi bi-trash3"></i></button>
      </div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:0.6rem;">
        <div>
          <label class="admin-label">Empresa</label>
          <input class="admin-input exp-company" value="${exp.company}" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Cargo / Rol</label>
          <input class="admin-input exp-role" value="${exp.role}" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Período</label>
          <input class="admin-input exp-period" value="${exp.period}" placeholder="2020 – 2022" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Color del ícono</label>
          <input class="admin-input exp-color" type="color" value="${exp.color || '#00d4ff'}" data-i="${i}" style="height:40px;padding:2px 6px;cursor:pointer;">
        </div>
      </div>
    </div>
  `).join('');
}

window.removeExp = function(i) {
  const d = PortfolioData.get();
  d.experience.splice(i, 1);
  renderExperienceList(d.experience);
};

document.getElementById('add-experience').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.experience.push({ id: Date.now(), company:'Nueva Empresa', role:'Cargo', period:'2024', color:'#00d4ff' });
  renderExperienceList(d.experience);
});

document.getElementById('save-experience').addEventListener('click', () => {
  const d = PortfolioData.get();
  const companies = document.querySelectorAll('.exp-company');
  const roles     = document.querySelectorAll('.exp-role');
  const periods   = document.querySelectorAll('.exp-period');
  const colors    = document.querySelectorAll('.exp-color');

  d.experience = [...companies].map((el, i) => ({
    id: Date.now() + i,
    company: el.value.trim(),
    role:    roles[i]?.value.trim(),
    period:  periods[i]?.value.trim(),
    color:   colors[i]?.value,
  }));
  PortfolioData.save(d);
  toast('¡Experiencia guardada!');
  renderExperienceList(d.experience);
});

// ── Education ─────────────────────────────────────────────────────────────────
function loadEducation(d) {
  renderEducationList(d.education);
}

function renderEducationList(list) {
  document.getElementById('education-list-admin').innerHTML = list.map((e, i) => `
    <div class="list-item" style="flex-direction:column;align-items:stretch;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <strong style="font-size:0.82rem;">#${i+1} — ${e.degree || ''}</strong>
        <button class="btn-icon del" onclick="removeEdu(${i})"><i class="bi bi-trash3"></i></button>
      </div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:0.6rem;">
        <div>
          <label class="admin-label">Título / Grado</label>
          <input class="admin-input edu-degree" value="${e.degree}" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Institución</label>
          <input class="admin-input edu-inst" value="${e.institution}" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Año(s)</label>
          <input class="admin-input edu-year" value="${e.year}" placeholder="2004 – 2009" data-i="${i}">
        </div>
      </div>
    </div>
  `).join('');
}

window.removeEdu = function(i) {
  const d = PortfolioData.get();
  d.education.splice(i, 1);
  renderEducationList(d.education);
};

document.getElementById('add-education').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.education.push({ id: Date.now(), degree:'', institution:'', year:'' });
  renderEducationList(d.education);
});

document.getElementById('save-education').addEventListener('click', () => {
  const d = PortfolioData.get();
  const degrees = document.querySelectorAll('.edu-degree');
  const insts   = document.querySelectorAll('.edu-inst');
  const years   = document.querySelectorAll('.edu-year');

  d.education = [...degrees].map((el, i) => ({
    id: Date.now() + i,
    degree:      el.value.trim(),
    institution: insts[i]?.value.trim(),
    year:        years[i]?.value.trim(),
  }));
  PortfolioData.save(d);
  toast('¡Educación guardada!');
  renderEducationList(d.education);
});

// ── Projects ──────────────────────────────────────────────────────────────────
function loadProjects(d) {
  renderProjectsList(d.projects);
}

function renderProjectsList(list) {
  document.getElementById('projects-list-admin').innerHTML = list.map((p, i) => `
    <div class="list-item" style="flex-direction:column;align-items:stretch;margin-bottom:0.75rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <strong style="font-size:0.82rem;">#${i+1} — ${p.title || 'Nuevo proyecto'}</strong>
        <button class="btn-icon del" onclick="removeProject(${i})"><i class="bi bi-trash3"></i></button>
      </div>
      <div class="form-grid" style="gap:0.6rem;">
        <div>
          <label class="admin-label">Título</label>
          <input class="admin-input proj-title" value="${p.title}" data-i="${i}">
        </div>
        <div>
          <label class="admin-label">Categoría</label>
          <select class="admin-select proj-cat" data-i="${i}">
            ${['Web','Backend','Mobile','DevOps','Open Source','Cybersecurity','Other'].map(c =>
              `<option value="${c}" ${p.category===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-full">
          <label class="admin-label">Descripción</label>
          <textarea class="admin-textarea proj-desc" rows="2" data-i="${i}">${p.description}</textarea>
        </div>
        <div class="form-full">
          <label class="admin-label">Imagen (URL o ruta)</label>
          <input class="admin-input proj-img" value="${p.image}" placeholder="https://..." data-i="${i}">
        </div>
        <div class="form-full">
          <label class="admin-label">Etiquetas (separadas por coma)</label>
          <input class="admin-input proj-tags" value="${p.tags.join(', ')}" data-i="${i}">
        </div>
      </div>
    </div>
  `).join('');
}

window.removeProject = function(i) {
  const d = PortfolioData.get();
  d.projects.splice(i, 1);
  renderProjectsList(d.projects);
};

document.getElementById('add-project').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.projects.push({ id: Date.now(), title:'Nuevo Proyecto', category:'Web', description:'', image:'', tags:[] });
  renderProjectsList(d.projects);
});

document.getElementById('save-projects').addEventListener('click', () => {
  const d = PortfolioData.get();
  const titles = document.querySelectorAll('.proj-title');
  const cats   = document.querySelectorAll('.proj-cat');
  const descs  = document.querySelectorAll('.proj-desc');
  const imgs   = document.querySelectorAll('.proj-img');
  const tags   = document.querySelectorAll('.proj-tags');

  d.projects = [...titles].map((el, i) => ({
    id:          Date.now() + i,
    title:       el.value.trim(),
    category:    cats[i]?.value,
    description: descs[i]?.value.trim(),
    image:       imgs[i]?.value.trim(),
    tags:        tags[i]?.value.split(',').map(t=>t.trim()).filter(Boolean),
  }));
  PortfolioData.save(d);
  toast('¡Proyectos guardados!');
  renderProjectsList(d.projects);
});

// ── Socials ───────────────────────────────────────────────────────────────────
function loadSocials(d) {
  renderSocialsList(d.socials);
}

function renderSocialsList(list) {
  const iconOptions = ['behance','facebook','linkedin','instagram','pinterest','twitter-x','whatsapp','youtube','tiktok','github','dribbble'];
  document.getElementById('socials-list').innerHTML = list.map((s, i) => `
    <div class="list-item">
      <div class="list-item-info">
        <div class="form-grid" style="grid-template-columns:1fr 1fr 2fr;gap:0.5rem;">
          <div>
            <label class="admin-label">Red</label>
            <select class="admin-select soc-icon" data-i="${i}">
              ${iconOptions.map(ic => `<option value="${ic}" ${s.icon===ic?'selected':''}>${ic}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="admin-label">Nombre</label>
            <input class="admin-input soc-name" value="${s.name}" data-i="${i}">
          </div>
          <div>
            <label class="admin-label">URL</label>
            <input class="admin-input soc-url" value="${s.url}" placeholder="https://..." data-i="${i}">
          </div>
        </div>
      </div>
      <button class="btn-icon del" onclick="removeSocial(${i})"><i class="bi bi-trash3"></i></button>
    </div>
  `).join('');
}

window.removeSocial = function(i) {
  const d = PortfolioData.get();
  d.socials.splice(i, 1);
  renderSocialsList(d.socials);
};

document.getElementById('add-social').addEventListener('click', () => {
  const d = PortfolioData.get();
  d.socials.push({ name:'Nueva Red', icon:'github', url:'#' });
  renderSocialsList(d.socials);
});

document.getElementById('save-socials').addEventListener('click', () => {
  const d = PortfolioData.get();
  const names = document.querySelectorAll('.soc-name');
  const icons = document.querySelectorAll('.soc-icon');
  const urls  = document.querySelectorAll('.soc-url');

  d.socials = [...names].map((el, i) => ({
    name: el.value.trim(),
    icon: icons[i]?.value,
    url:  urls[i]?.value.trim(),
  }));
  PortfolioData.save(d);
  toast('¡Redes sociales guardadas!');
});

// ── Security ──────────────────────────────────────────────────────────────────
function loadSecurity(d) {
  const auth = PortfolioData.getAuth();
  document.getElementById('new-username').value = auth.username;
}

document.getElementById('save-security').addEventListener('click', async () => {
  const u  = document.getElementById('new-username').value.trim();
  const p1 = document.getElementById('new-password').value;
  const p2 = document.getElementById('confirm-password').value;

  if (!u) { toast('El usuario no puede estar vacío', 'error'); return; }
  if (p1 && p1.length < 6) { toast('La contraseña debe tener al menos 6 caracteres', 'error'); return; }
  if (p1 && p1 !== p2) { toast('Las contraseñas no coinciden', 'error'); return; }

  const res = await PortfolioData.updateSecurity(u, p1);
  if (res.success) {
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    toast('¡Credenciales actualizadas en BD!');
  } else {
    toast(res.error || 'Error al actualizar', 'error');
  }
});

document.getElementById('reset-data').addEventListener('click', async () => {
  if (confirm('¿Estás seguro? Esto eliminará todos los cambios en SQLite y restaurará los datos originales.')) {
    const success = await PortfolioData.reset();
    if (success) {
      toast('Datos restablecidos correctamente');
      loadPanel(currentPanel);
    } else {
      toast('Error al restablecer datos', 'error');
    }
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
(async () => {
  await PortfolioData.getAsync();
  loadPanel('dashboard');
})();
