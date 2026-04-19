const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const plans = await prisma.actionPlan.findMany({ where: { teamId: req.user.teamId },
    include: { steps: { orderBy: { stepNumber: 'asc' } }, _count: { select: { enrollments: true } } } });
  res.json(plans);
});

router.get('/:id', auth, async (req, res) => {
  const p = await prisma.actionPlan.findUnique({ where: { id: req.params.id },
    include: { steps: { orderBy: { stepNumber: 'asc' } }, enrollments: { include: { contact: true } } } });
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});

router.post('/', auth, async (req, res) => {
  const { steps = [], ...data } = req.body;
  const p = await prisma.actionPlan.create({ data: { ...data, teamId: req.user.teamId,
    steps: { create: steps.map((s,i) => ({ dayOfPlan: s.dayOfPlan, timeOfDay: s.timeOfDay, contactMethod: s.contactMethod, stepNumber: i+1 })) } } });
  res.json(p);
});

router.put('/:id', auth, async (req, res) => {
  const { steps = [], enrollments, _count, ...data } = req.body;
  await prisma.actionPlanStep.deleteMany({ where: { planId: req.params.id } });
  const p = await prisma.actionPlan.update({ where: { id: req.params.id }, data: { ...data,
    steps: { create: steps.map((s,i) => ({ dayOfPlan: s.dayOfPlan, timeOfDay: s.timeOfDay, contactMethod: s.contactMethod, stepNumber: i+1 })) } } });
  res.json(p);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.actionPlan.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:id/enroll', auth, async (req, res) => {
  const e = await prisma.actionPlanEnrollment.create({ data: { planId: req.params.id, contactId: req.body.contactId } });
  res.json(e);
});

module.exports = router;
