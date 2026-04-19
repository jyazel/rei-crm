const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const { from, to } = req.query;
  const teamId = req.user.teamId;
  const dateFilter = from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : {};
  const [dealsAdded, propertiesPurchased, campaigns, messages] = await Promise.all([
    prisma.deal.count({ where: { teamId, ...dateFilter } }),
    prisma.property.count({ where: { teamId, status: 'purchased' } }),
    prisma.campaign.findMany({ where: { teamId }, select: { name: true, amountSpent: true, responseRate: true, _count: { select: { records: true, deals: true } } } }),
    prisma.message.findMany({ where: { conversation: { teamId } }, select: { type: true, direction: true, duration: true, createdAt: true } }),
  ]);
  const calls  = messages.filter(m => m.type === 'call');
  const texts  = messages.filter(m => m.type === 'text');
  const emails = messages.filter(m => m.type === 'email');
  res.json({
    summary: { dealsAdded, propertiesPurchased, offersMade: 0, propertiesSold: 0 },
    communication: {
      totalConversations: messages.length,
      callsMade: calls.filter(c => c.direction === 'outbound').length,
      callsMissed: 0,
      talkTime: calls.reduce((a, c) => a + (c.duration || 0), 0),
      textsSent: texts.filter(t => t.direction === 'outbound').length,
      emailsSent: emails.filter(e => e.direction === 'outbound').length,
    },
    campaigns,
  });
});

module.exports = router;
