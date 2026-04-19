const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const { type } = req.query;
  const t = await prisma.template.findMany({ where: { teamId: req.user.teamId, ...(type ? { type } : {}) }, orderBy: { updatedAt: 'desc' } });
  res.json(t);
});

router.post('/', auth, async (req, res) => {
  const t = await prisma.template.create({ data: { ...req.body, teamId: req.user.teamId } });
  res.json(t);
});

router.put('/:id', auth, async (req, res) => {
  const t = await prisma.template.update({ where: { id: req.params.id }, data: req.body });
  res.json(t);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.template.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
