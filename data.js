const express = require('express');
const router = express.Router();
const { prisma, DEFAULT_DATA } = require('../database');
const { authenticateToken } = require('../authMiddleware');

// GET /api/data
router.get('/', async (req, res) => {
  try {
    const row = await prisma.portfolioData.findUnique({ where: { id: 1 } });
    if (!row) {
      return res.json(DEFAULT_DATA);
    }
    res.json(JSON.parse(row.content));
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    res.status(500).json({ error: 'Error obteniendo datos' });
  }
});

// PUT /api/data
router.put('/', authenticateToken, async (req, res) => {
  try {
    const newData = req.body;
    await prisma.portfolioData.upsert({
      where: { id: 1 },
      update: { content: JSON.stringify(newData) },
      create: { id: 1, content: JSON.stringify(newData) }
    });
    res.json({ success: true, message: 'Datos actualizados en Prisma ORM' });
  } catch (error) {
    console.error("Error guardando datos:", error);
    res.status(500).json({ error: 'Error guardando datos' });
  }
});

// POST /api/data/reset
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    await prisma.portfolioData.upsert({
      where: { id: 1 },
      update: { content: JSON.stringify(DEFAULT_DATA) },
      create: { id: 1, content: JSON.stringify(DEFAULT_DATA) }
    });
    res.json({ success: true, message: 'Datos restablecidos por defecto' });
  } catch (error) {
    console.error("Error restableciendo datos:", error);
    res.status(500).json({ error: 'Error restableciendo datos' });
  }
});

module.exports = router;
