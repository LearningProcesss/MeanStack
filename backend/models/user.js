const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

schema.plugin(uniqueValidator);

schema.methods.compara = async function (passwordFrom) {

    var utente = this;

    try {
        var ret = await bcrypt.compare(passwordFrom, utente.password);
        return ret;
    } catch (error) {

    }
};

schema.methods.creaToken = function () {

    var utente = this;

    var token = jwt.sign({
        email: utente.email, id: utente._id
    }, process.env.KEY, { expiresIn: "1h" });

    return token;
}

schema.statics.trovaByToken = async function (tokenFrom) {

    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(tokenFrom, process.env.KEY);
    } catch (error) {

    }

    return await User.findOne({ _id: decoded.id });
};

schema.pre("save", function (next) {

    var utente = this;

    bcrypt.genSalt(5).then((salt) => {
        bcrypt.hash(utente.password, salt).then((hash) => {
            utente.password = hash;
            next();
        }).catch((error) => {

        });
    });
});

var User = mongoose.model('User', schema);

module.exports = { User };