const express = require('express');
const doubtRouter =express.Router();
const {auth} = require('../Middleware/auth');
const Doubt = require('../Model/Doubt');


doubtRouter.post('/create',auth, async (req, res) => {
    try {
        const { question } = req.body;
         const userId = req.user.userId; 
        const newDoubt = new Doubt({
            userId,
            question
        });

        await newDoubt.save();
        res.json(newDoubt);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


doubtRouter.put('/update/:doubtId', auth, async (req, res) => {
    try {
        const { answer } = req.body;
        const userId = req.user.userId; 
        const userType = req.user.userType; 
        const { doubtId } = req.params;

        const doubt = await Doubt.findById(doubtId);

 
        if (userType !== 'Tutor' || !doubt ) {
            return res.status(403).json({ message: 'Unauthorized to update doubt' });
        }

        doubt.answer = answer;
        await doubt.save();

        res.json(doubt);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

doubtRouter.get('/history', auth, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const doubts = await Doubt.find({ userId }).sort({ createdAt: -1 });
        res.json(doubts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = {doubtRouter};
