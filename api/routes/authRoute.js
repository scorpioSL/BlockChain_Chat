const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/save", userController.save);
router.post("/edit", userController.edit);
router.post("/login", userController.login);

module.exports = router;
