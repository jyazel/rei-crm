const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sign = (user, teamId) => jwt.sign({ id: user.id, email: user.email, teamId }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user, user.teamId), user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, teamId: user.teamId } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, teamName } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const team = await prisma.team.create({ data: { name: teamName || firstName + "'s Team" } });
    const user = await prisma.user.create({ data: { email, password: hash, firstName, lastName, teamId: team.id, role: 'admin' } });
    const boardSeeds = [
      { name: 'Seller Deals', type: 'seller_deals', stages: [
        { name: 'Lead In', color: '#6366f1', order: 0 }, { name: 'Due Diligence', color: '#f59e0b', order: 1 },
        { name: 'Send Offer', color: '#10b981', order: 2 }, { name: 'PA Signed', color: '#3b82f6', order: 3 }, { name: 'Close', color: '#f97316', order: 4 }]},
      { name: 'Buyer Deals', type: 'buyer_deals', stages: [
        { name: 'Lead In', color: '#6366f1', order: 0 }, { name: 'Nurture Buyer', color: '#8b5cf6', order: 1 },
        { name: 'Send Offer', color: '#10b981', order: 2 }, { name: 'Closing', color: '#f97316', order: 3 }]},
      { name: 'Inventory', type: 'inventory', stages: [
        { name: 'Pre-Listing', color: '#f59e0b', order: 0 }, { name: 'List', color: '#3b82f6', order: 1 }, { name: 'Refresh Listing', color: '#10b981', order: 2 }]},
    ];
    for (const b of boardSeeds)
      await prisma.board.create({ data: { name: b.name, type: b.type, teamId: team.id, stages: { create: b.stages } } });
    await prisma.inbox.createMany({ data: [
      { name: 'Buyer Inbox', type: 'buyer', teamId: team.id },
      { name: 'Seller Inbox', type: 'seller', teamId: team.id }
    ]});
    res.json({ token: sign(user, team.id), user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, teamId: team.id } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
