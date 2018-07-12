const { User } = require("../models/user");

module.exports = async (req, resp, next) => {

    try {

        const tokenFrom = req.headers.authorization.split(" ")[1];

        const utente = await User.trovaByToken(tokenFrom);

        if (utente) {

        }

        req.utenteloggato = { email: utente.email, id: utente._id };

        console.log(req.utenteloggato);

        next();
        
    } catch (error) {
        resp.status(401).send();
    }
};