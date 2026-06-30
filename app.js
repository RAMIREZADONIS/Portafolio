// ─── Portfolio Data Layer (SQLite API Client) ────────────────────────────────
// Realiza peticiones al servidor Express y almacena un caché en memoria.

const PortfolioData = {
  _cache: null,
  _listeners: [],

  // Inicializar o cargar datos desde la API
  async init() {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        this._cache = await response.json();
        this._notify();
      }
    } catch (error) {
      console.error("Error conectando con la API SQLite:", error);
    }
  },

  // Obtener datos (sincrónico si están en caché)
  get() {
    return this._cache || window.DEFAULT_FALLBACK;
  },

  // Obtener datos de forma asíncrona asegurando que el servidor ha contestado
  async getAsync() {
    if (!this._cache) {
      await this.init();
    }
    return this.get();
  },

  // Guardar datos en la base de datos
  async save(data) {
    this._cache = data;
    this._notify();
    try {
      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}`
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error("Error guardando en la API:", error);
      return { success: false, error: 'Error de conexión' };
    }
  },

  // Restablecer datos en la base de datos
  async reset() {
    try {
      const res = await fetch('/api/data/reset', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}`
        }
      });
      if (res.ok) {
        await this.init();
        return true;
      }
    } catch (error) {
      console.error("Error restableciendo datos:", error);
    }
    return false;
  },

  // Suscribir funciones que reaccionan a cambios
  subscribe(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._cache));
  },

  // Autenticación asíncrona
  async login(username, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("portfolio_admin", "true");
        sessionStorage.setItem("portfolio_token", data.token);
        sessionStorage.setItem("portfolio_user", data.username);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  async updateSecurity(username, password) {
    try {
      const res = await fetch('/api/auth/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}`
        },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("portfolio_user", username);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  },

  getAuth() {
    return {
      username: sessionStorage.getItem("portfolio_user") || "admin"
    };
  },

  isLoggedIn() {
    return sessionStorage.getItem("portfolio_admin") === "true";
  },

  setLoggedIn(val) {
    if (!val) {
      sessionStorage.removeItem("portfolio_admin");
      sessionStorage.removeItem("portfolio_token");
      sessionStorage.removeItem("portfolio_user");
    }
  }
};

// Fallback temporal mientras carga el servidor
window.DEFAULT_FALLBACK = {
  personal: { firstName: "Cargando...", lastName: "", title: "Full Stack Developer", email: "", phone: "", location: "", address: "", bio: "", photo: "profile.png" },
  socials: [], softwareSkills: [], languages: [], personalSkills: [], whatCanIDo: [], designSkills: [], hobbies: [], experience: [], education: [], projects: []
};

// Iniciar carga al cargar el script
PortfolioData.init();
