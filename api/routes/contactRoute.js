const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const contactController = require("../controllers/contactController");

router.get("/users", userController.getall);
router.post("/add", contactController.add);
router.post("/getContactList", contactController.getList);

module.exports = router;
