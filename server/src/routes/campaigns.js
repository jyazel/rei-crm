const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const campaigns = await prisma.campaign.findMany({ where: { teamId: req.user.teamId },
    include: { _count: { select: { records: true, deals: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(campaigns);
});

router.get('/:id', auth, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const c = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { _count: { select: { records: true } } } });
  if (!c) return res.status(404).json({ error: 'Not found' });
  const records = await prisma.campaignRecord.findMany({ where: { campaignId: req.params.id },
    include: { contact: true, property: true }, skip: (+page-1)*+limit, take: +limit, orderBy: { createdAt: 'asc' } });
  const recordsTotal = await prisma.campaignRecord.count({ where: { campaignId: req.params.id } });
  res.json({ ...c, records, recordsTotal });
});

router.post('/', auth, async (req, res) => {
  const c = await prisma.campaign.create({ data: { ...req.body, teamId: req.user.teamId } });
  res.json(c);
});

router.put('/:id', auth, async (req, res) => {
  const { records, deals, _count, ...data } = req.body;
  const c = await prisma.campaign.update({ where: { id: req.params.id }, data });
  res.json(c);
});

module.exports = router;
