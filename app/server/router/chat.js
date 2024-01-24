const express = require('express');
const router = express.Router();
const Message = require('../model/Message');

// 메시지 저장
router.post('/message', async(req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).send(newMessage);
    } catch(err){
        res.status(500).send(err)
    }
})

// 메시지 불러오기
router.get('/getMessages', async(req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;