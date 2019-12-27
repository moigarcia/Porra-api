const express = require("express");
const router = express.Router();
const secure = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/", secure.isAuthenticated, userController.getAll);
router.get("/classification", userController.getClassification);
router.get("/:id", secure.isAuthenticated, userController.getById);

router.delete("/:id", secure.isAuthenticated, userController.delete);

module.exports = router;
