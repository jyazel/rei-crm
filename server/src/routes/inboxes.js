const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const inboxes = await prisma.inbox.findMany({ where: { teamId: req.user.teamId },
    include: { _count: { select: { conversations: true } } } });
  res.json(inboxes);
});

router.put('/:id', auth, async (req, res) => {
  const i = await prisma.inbox.update({ where: { id: req.params.id }, data: req.body });
  res.json(i);
});

router.get('/:id/conversations', auth, async (req, res) => {
  const { tab } = req.query;
  const conversations = await prisma.conversation.findMany({
    where: { inboxId: req.params.id, ...(tab === 'unread' ? { isRead: false } : {}) },
    include: { contact: true, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { updatedAt: 'desc' } });
  res.json(conversations);
});

router.post('/:id/conversations', auth, async (req, res) => {
  const c = await prisma.conversation.create({ data: { ...req.body, inboxId: req.params.id, teamId: req.user.teamId } });
  res.json(c);
});

router.get('/conversations/:id', auth, async (req, res) => {
  const c = await prisma.conversation.findUnique({ where: { id: req.params.id },
    include: { contact: true, messages: { orderBy: { createdAt: 'asc' } } } });
  c ? res.json(c) : res.status(404).json({ error: 'Not found' });
});

router.post('/conversations/:id/messages', auth, async (req, res) => {
  const m = await prisma.message.create({ data: { ...req.body, conversationId: req.params.id } });
  await prisma.conversation.update({ where: { id: req.params.id }, data: { updatedAt: new Date() } });
  res.json(m);
});

module.exports = router;
