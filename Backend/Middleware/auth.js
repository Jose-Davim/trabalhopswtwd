const basicAuth = require('basic-auth');

const User = require('../Models/user');

module.exports = async (req, res, next) => {
    const credentials = basicAuth(req);
    if (!credentials || !credentials.name || !credentials.pass) {
        return res.status(401).json({erro: 'Credenciais ausentes ou inválidas' });
    }
    try {
        const user = await User.findOne({username: credentials.name});
        if (!user || user.password !== credentials.pass) {
            return res.status(401).json({ erro: 'Autenticação falhou' });
    }
    req.user = user;
    next();
    } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar credenciais' });
    }   
}