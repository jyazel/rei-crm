const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const deals = await prisma.deal.findMany({ where: { teamId: req.user.teamId },
    include: { stage: { include: { board: true } }, contacts: { include: { contact: true } } },
    orderBy: { createdAt: 'desc' } });
  res.json(deals);
});

router.get('/:id', auth, async (req, res) => {
  const d = await prisma.deal.findUnique({ where: { id: req.params.id },
    include: { stage: { include: { board: true } }, contacts: { include: { contact: true } },
      properties: { include: { property: true } }, tasks: { include: { assignee: true } },
      notes: { orderBy: { createdAt: 'desc' } }, campaign: true } });
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  const { contactIds, ...data } = req.body;
  const d = await prisma.deal.create({ data: { ...data, teamId: req.user.teamId,
    ...(contactIds?.length ? { contacts: { create: contactIds.map(id => ({ contactId: id })) } } : {}) } });
  res.json(d);
});

router.put('/:id', auth, async (req, res) => {
  const { contacts, properties, tasks, notes, campaign, stage, ...data } = req.body;
  const d = await prisma.deal.update({ where: { id: req.params.id }, data });
  res.json(d);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.deal.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:id/notes', auth, async (req, res) => {
  const n = await prisma.note.create({ data: { body: req.body.body, dealId: req.params.id, authorId: req.user.id, teamId: req.user.teamId } });
  res.json(n);
});

router.post('/:id/contacts', auth, async (req, res) => {
  await prisma.dealContact.create({ data: { dealId: req.params.id, contactId: req.body.contactId } });
  res.json({ success: true });
});

router.post('/:id/properties', auth, async (req, res) => {
  await prisma.dealProperty.create({ data: { dealId: req.params.id, propertyId: req.body.propertyId } });
  res.json({ success: true });
});

module.exports = router;
