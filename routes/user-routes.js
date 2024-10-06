const express = require('express');
const {signup, login, verifyToken, getUser} = require('../Backend/controllers/user-controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
// verify token

module.exports = router;