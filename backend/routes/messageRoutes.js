const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/conversations
// @desc    Get all active message conversation contacts for logged-in user
router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name avatar role email')
      .populate('receiver', 'name avatar role email')
      .sort({ createdAt: -1 });

    const contactMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
      if (!otherUser) return;
      const otherId = otherUser._id.toString();

      if (!contactMap.has(otherId)) {
        contactMap.set(otherId, {
          user: otherUser,
          lastMessage: msg.content,
          lastTimestamp: msg.createdAt,
          unread: !msg.read && msg.receiver._id.toString() === req.user._id.toString()
        });
      }
    });

    res.json({ success: true, data: Array.from(contactMap.values()) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get chat message history with a specific user
router.get('/:userId', protect, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: targetUserId },
        { sender: targetUserId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: targetUserId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/messages
// @desc    Send a new chat message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, error: 'Receiver ID and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      type: type || 'chat'
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({ success: true, data: populatedMsg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
