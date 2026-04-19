const router = require('express').Router();
const auth   = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  const boards = await prisma.board.findMany({ where: { teamId: req.user.teamId },
    include: { stages: { orderBy: { order: 'asc' } } } });
  res.json(boards);
});

router.get('/:id', auth, async (req, res) => {
  const board = await prisma.board.findUnique({ where: { id: req.params.id },
    include: { stages: { orderBy: { order: 'asc' }, include: {
      deals: { include: { contacts: { include: { contact: true } } }, orderBy: { createdAt: 'desc' } }
    }}} });
  board ? res.json(board) : res.status(404).json({ error: 'Not found' });
});

router.post('/:boardId/stages', auth, async (req, res) => {
  const s = await prisma.stage.create({ data: { ...req.body, boardId: req.params.boardId } });
  res.json(s);
});

router.put('/stages/:id', auth, async (req, res) => {
  const s = await prisma.stage.update({ where: { id: req.params.id }, data: req.body });
  res.json(s);
});

router.delete('/stages/:id', auth, async (req, res) => {
  await prisma.stage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
