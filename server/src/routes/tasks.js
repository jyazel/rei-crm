const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const { status, due } = req.query;
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const todayEnd   = new Date(now); todayEnd.setHours(23,59,59,999);
  const where = { teamId: req.user.teamId,
    ...(status === 'todo' ? { completedAt: null } : status === 'done' ? { completedAt: { not: null } } : {}),
    ...(due === 'overdue' ? { dueDate: { lt: now }, completedAt: null } :
        due === 'today'   ? { dueDate: { gte: todayStart, lte: todayEnd } } :
        due === 'week'    ? { dueDate: { lte: new Date(now.getTime()+7*86400000) } } : {}) };
  const tasks = await prisma.task.findMany({ where,
    include: { assignee: true, deal: { include: { stage: true } } }, orderBy: { dueDate: 'asc' } });
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  const t = await prisma.task.create({ data: { ...req.body, teamId: req.user.teamId } });
  res.json(t);
});

router.put('/:id', auth, async (req, res) => {
  const { assignee, deal, ...data } = req.body;
  const t = await prisma.task.update({ where: { id: req.params.id }, data });
  res.json(t);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
