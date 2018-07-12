const express = require('express');
var { ObjectID } = require("mongodb");
const _ = require("lodash");
const { User } = require("../models/user");


const router = express.Router();

router.post("/login", async (req, resp) => {

    console.log(req.body);


    var usr = await User.findOne({ email: req.body.email });

    console.log(usr);

    if (!usr) {
        return resp.status(404).send();
    }

    try {

        var ret = await usr.compara(req.body.password);

        if (!ret) {
            return resp.status(404).send();
        }

        var tok = usr.creaToken();

        resp.status(200).json({ token: tok, expire: 3600 * 1000, uId: usr._id });

    } catch (error) {
        console.log(error);
    }
});

router.post("/signup", (req, resp) => {

    var userBody = _.pick(req.body, ["email", "password"]);

    const user = new User(userBody);

    user.save().then((result) => {
        resp.status(201).json({
            message: "User created",
            result: result
        });
    }).catch((err) => {
        console.log(err);

        resp.status(500).json({
            error: err
        });
    });
});

module.exports = router;