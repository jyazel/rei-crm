const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const { search, category, page = 1, limit = 25 } = req.query;
  const where = { teamId: req.user.teamId,
    ...(category && category !== 'None' ? { category } : {}),
    ...(search ? { OR: [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phonePrimary: { contains: search } }
    ]} : {}) };
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({ where, skip: (+page-1)*+limit, take: +limit, orderBy: { fullName: 'asc' } }),
    prisma.contact.count({ where })]);
  res.json({ contacts, total, page: +page, pages: Math.ceil(total/+limit) });
});

router.get('/:id', auth, async (req, res) => {
  const c = await prisma.contact.findUnique({ where: { id: req.params.id },
    include: { properties: true, deals: { include: { deal: { include: { stage: true } } } },
      campaignRecords: { include: { campaign: true } }, conversations: true, enrollments: { include: { plan: true } } } });
  c ? res.json(c) : res.status(404).json({ error: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  const c = await prisma.contact.create({ data: { ...req.body, teamId: req.user.teamId } });
  res.json(c);
});

router.put('/:id', auth, async (req, res) => {
  const { deals, properties, campaignRecords, conversations, enrollments, ...data } = req.body;
  const c = await prisma.contact.update({ where: { id: req.params.id }, data });
  res.json(c);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.contact.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
