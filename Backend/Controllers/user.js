const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../Models/user');
const router = express.Router();

router.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: false,
}));

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            loggedIn: true,
        };
        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao sair', error: err });
        }
        res.status(200).json({ message: 'Logout bem-sucedido' });
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.user.loggedIn) {
        return next();
    }
    res.status(401).json({ message: 'Não autorizado' });
};

router.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.session.user.username}` });
});

module.exports = router;
