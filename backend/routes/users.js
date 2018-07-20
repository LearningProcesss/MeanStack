const express = require('express');
var { ObjectID } = require("mongodb");
const _ = require("lodash");
const { User } = require("../models/user");


const router = express.Router();

router.post("/login", async (req, resp) => {

    const usr = await User.findOne({ email: req.body.email });

    if (!usr) {
        return resp.status(404).json({ messaggioErrore: "Email errata o utente non trovato." });
    }

    try {

        var ret = await usr.compara(req.body.password);

        if (!ret) {
            return resp.status(404).json({ messaggioErrore: "Password errata." });
        }

        var tok = usr.creaToken();

        resp.status(200).json({ token: tok, expire: 3600 * 1000, uId: usr._id });

    } catch (error) {
         resp.status(500).json({ messaggioErrore: "Errore autenticazione." });
    }
});

router.post("/signup", async (req, resp) => {

    var userBody = _.pick(req.body, ["email", "password"]);

    const user = new User(userBody);

    try {

        const userUpdated = await user.save();

        resp.status(201).json({ messagioOk: "Creato.", email: userUpdated.email });

    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore autenticazione." });
    }
    

    // user.save().then((result) => {
    //     resp.status(201).json({
    //         message: "User created",
    //         result: result
    //     });
    // }).catch((err) => {
    //     console.log(err);

    //     resp.status(500).json({
    //         error: err
    //     });
    // });
});

module.exports = router;