const { PrismaClient } = require('@prisma/client');
const { queryDeepSeek } = require('../services/deepseekService');
const { hasAccess } = require('../utils/privilegeCheck');

const prisma = new PrismaClient();

const getAIResponse = async (req, res) => {
  const { prompt } = req.body;
  const { id, role } = req.user;

  // Call DeepSeek API to interpret the prompt
  const aiReply = await queryDeepSeek(prompt);

  // Naive parsing logic (replace with NLP if needed)
  const normalizedPrompt = prompt.toLowerCase();
  let requestedDataType = null;

  if (normalizedPrompt.includes('result')) requestedDataType = role === 'student' ? 'own_results' : 'results';
  else if (normalizedPrompt.includes('payment')) requestedDataType = 'own_payments';
  else if (normalizedPrompt.includes('announcement')) requestedDataType = 'announcements';

  if (!requestedDataType || !hasAccess(role, requestedDataType)) {
    return res.status(403).json({ message: 'Access denied or data not available' });
  }

  try {
    let data;

    if (requestedDataType === 'own_results') {
      data = await prisma.result.findMany({
        where: { studentId: id },
        include: { teacher: true }
      });
    } else if (requestedDataType === 'own_payments') {
      data = await prisma.payment.findMany({
        where: { studentId: id }
      });
    } else if (requestedDataType === 'results') {
      data = await prisma.result.findMany({
        where: { teacherId: id },
        include: { student: true }
      });
    } else if (requestedDataType === 'announcements') {
      data = await prisma.announcement.findMany({
        where: { teacherId: id }
      });
    }

    return res.json({ aiSummary: aiReply, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getAIResponse;
