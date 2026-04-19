const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const { search, page = 1, limit = 25 } = req.query;
  const where = { teamId: req.user.teamId,
    ...(search ? { OR: [
      { address: { contains: search, mode: 'insensitive' } },
      { apn: { contains: search, mode: 'insensitive' } }
    ]} : {}) };
  const [properties, total] = await Promise.all([
    prisma.property.findMany({ where, skip: (+page-1)*+limit, take: +limit, include: { owner: true }, orderBy: { createdAt: 'desc' } }),
    prisma.property.count({ where })]);
  res.json({ properties, total, page: +page, pages: Math.ceil(total/+limit) });
});

router.get('/:id', auth, async (req, res) => {
  const p = await prisma.property.findUnique({ where: { id: req.params.id },
    include: { owner: true, campaignRecords: { include: { campaign: true } }, deals: { include: { deal: { include: { stage: true } } } } } });
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  const p = await prisma.property.create({ data: { ...req.body, teamId: req.user.teamId } });
  res.json(p);
});

router.put('/:id', auth, async (req, res) => {
  const { owner, campaignRecords, deals, ...data } = req.body;
  const p = await prisma.property.update({ where: { id: req.params.id }, data });
  res.json(p);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.property.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
