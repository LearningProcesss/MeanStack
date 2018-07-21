const express = require('express');
const userCntrl = require("../controllers/userController");


const router = express.Router();

router.post("/login", userCntrl.loginUser);

router.post("/signup", userCntrl.createUser);

module.exports = router;