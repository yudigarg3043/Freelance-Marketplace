const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const router = express.Router();

/*GET My Conversations*/
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'name'
        }
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/*GET Messages of Conversation*/
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/*SEND Message*/
router.post('/:conversationId', auth, async (req, res) => {
  try {
    const { text } = req.body;

    const message = new Message({
      conversation: req.params.conversationId,
      sender: req.user._id,
      text,
      readBy: [req.user._id]
    });

    await message.save();

    await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      { lastMessage: message._id },
      { new: true }
    );

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;