const express = require('express');
const User = require('../Models/user');
const router = express.Router();

router.get('/', async(req, res) => {
    const user = await User.find().populate('user');
    res.json(user);
});

router.post('/', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
   });

router.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
   new: true });
    res.json(user);
   });

router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'User Apagado' });
   });
   
module.exports = router;