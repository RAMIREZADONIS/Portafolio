const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// En Vercel Serverless, copiar la BD a /tmp para permitir lecturas y escrituras sin error EROFS
let dbUrl = 'file:./portfolio.db';
if (process.env.VERCEL) {
  const tmpPath = path.resolve('/tmp', 'portfolio.db');
  const dbPath = path.resolve(__dirname, 'portfolio.db');
  if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
    try { fs.copyFileSync(dbPath, tmpPath); } catch(e) {}
  }
  dbUrl = 'file:/tmp/portfolio.db';
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl }
  }
});

const DEFAULT_DATA = {
  personal: {
    firstName: "Alex",
    lastName: "Rivera",
    title: "Full Stack Developer & IT Engineer",
    email: "alex.rivera@devfolio.io",
    phone: "+1 (305) 742-8819",
    location: "Miami, Florida",
    address: "2340 NW 14th Street",
    bio: "Full Stack Developer and IT Engineer with 8+ years of experience building scalable web applications and cloud infrastructure. Passionate about clean code, system design, and solving complex technical challenges. I bridge the gap between elegant front-end experiences and robust back-end architecture — always with performance and security in mind.",
    photo: "profile.png",
  },
  socials: [
    { name: "GitHub",    icon: "github",    url: "#" },
    { name: "LinkedIn",  icon: "linkedin",  url: "#" },
    { name: "Twitter",   icon: "twitter-x", url: "#" },
    { name: "YouTube",   icon: "youtube",   url: "#" },
    { name: "Instagram", icon: "instagram", url: "#" },
  ],
  softwareSkills: [
    { name: "JavaScript / TypeScript", percent: 95 },
    { name: "React / Next.js",         percent: 90 },
    { name: "Node.js / Express",       percent: 88 },
    { name: "Python / Django",         percent: 80 },
    { name: "Docker / Kubernetes",     percent: 75 },
    { name: "AWS / Cloud",             percent: 72 },
    { name: "PostgreSQL / MongoDB",    percent: 85 },
  ],
  languages: [
    { name: "English", percent: 98 },
    { name: "Spanish", percent: 85 },
    { name: "French",  percent: 35 },
  ],
  personalSkills: ["Problem Solving", "Team Leadership", "Agile / Scrum", "Critical Thinking"],
  whatCanIDo: [
    "Full Stack Web Development",
    "REST API & GraphQL Design",
    "Cloud Architecture & DevOps",
    "Database Design & Optimization",
    "Cybersecurity & IT Infrastructure",
    "Technical Consulting & Mentoring",
  ],
  designSkills: [
    "Clean Code · SOLID Principles",
    "System Design · Microservices",
    "CI/CD · Test-Driven Development",
    "Performance · Security · Scalability",
  ],
  hobbies: [
    { name: "Open Source", icon: "code" },
    { name: "Gaming",      icon: "film" },
    { name: "CTF / Hacking", icon: "star" },
    { name: "Tech Blogs",  icon: "book-open" },
  ],
  experience: [
    {
      id: 1,
      company: "TechNova Labs",
      role: "Senior Full Stack Engineer",
      period: "2021 – Present",
      color: "#00d4ff",
    },
    {
      id: 2,
      company: "CloudSync Inc.",
      role: "Backend Developer & DevOps",
      period: "2018 – 2021",
      color: "#0099cc",
    },
    {
      id: 3,
      company: "DataBridge Solutions",
      role: "Software Developer",
      period: "2016 – 2018",
      color: "#007aa3",
    },
    {
      id: 4,
      company: "StartUp Ventures Co.",
      role: "Junior Web Developer",
      period: "2014 – 2016",
      color: "#005f80",
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.S. Computer Science",
      institution: "Florida International University",
      year: "2010 – 2014",
    },
    {
      id: 2,
      degree: "AWS Solutions Architect",
      institution: "Amazon Web Services (Certified)",
      year: "2020",
    },
  ],
  projects: [
    {
      id: 1,
      title: "DevFlow SaaS Platform",
      category: "Web",
      description: "Full-featured project management SaaS built with Next.js, Node.js, and PostgreSQL. Real-time collaboration via WebSockets.",
      image: "",
      tags: ["Next.js", "Node.js", "PostgreSQL", "WebSockets"],
    },
    {
      id: 2,
      title: "SecureVault API",
      category: "Backend",
      description: "RESTful API for encrypted secret management. JWT auth, rate limiting, audit logging, and Docker deployment.",
      image: "",
      tags: ["Node.js", "Express", "JWT", "Docker"],
    },
    {
      id: 3,
      title: "CloudWatch Dashboard",
      category: "DevOps",
      description: "Infrastructure monitoring dashboard on AWS. Auto-scaling groups, CloudWatch metrics, Terraform IaC.",
      image: "",
      tags: ["AWS", "Terraform", "CloudWatch", "Python"],
    },
    {
      id: 4,
      title: "ShopPulse Mobile App",
      category: "Mobile",
      description: "Cross-platform e-commerce mobile app built with React Native and Firebase. Push notifications and offline support.",
      image: "",
      tags: ["React Native", "Firebase", "Expo"],
    },
    {
      id: 5,
      title: "AI Code Reviewer",
      category: "Open Source",
      description: "GitHub bot that uses OpenAI to perform automated code reviews on pull requests. 1k+ stars on GitHub.",
      image: "",
      tags: ["Python", "OpenAI", "GitHub Actions"],
    },
    {
      id: 6,
      title: "NetSentinel",
      category: "Cybersecurity",
      description: "Network intrusion detection system with real-time packet analysis and threat scoring using ML models.",
      image: "",
      tags: ["Python", "Scapy", "scikit-learn", "SQLite"],
    },
  ],
};

async function initDb() {
  try {
    const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("portfolio2024", 10);
      await prisma.user.create({
        data: { username: "admin", password: hashedPassword }
      });
      console.log("Usuario admin por defecto creado en Prisma.");
    }

    const data = await prisma.portfolioData.findUnique({ where: { id: 1 } });
    if (!data) {
      await prisma.portfolioData.create({
        data: { id: 1, content: JSON.stringify(DEFAULT_DATA) }
      });
      console.log("Datos por defecto cargados en Prisma.");
    }
  } catch (error) {
    // Si la tabla no existe aún o hay un retraso en la carga, se capturará aquí
    console.log("Esperando inicialización de esquema Prisma...");
  }
}

initDb();

module.exports = {
  prisma,
  DEFAULT_DATA
};
