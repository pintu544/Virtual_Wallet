const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// router.get('/login', userController.login);
// router.get('/register', userController.register);
router.post("/login", userController.createLogin);
router.post("/register", userController.createRegister);
router.get("/logout", userController.userLogout);

module.exports = router;
