const express = require("express");
const router = express.Router();
const secure = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/", userController.getAll);
router.get("/classification", userController.getClassification);
router.get("/:id", userController.getById);

router.delete("/:id", userController.delete);

module.exports = router;
