const express = require("express");
const router = express.Router();
const secure = require("../middlewares/auth.middleware");
const dayController = require("../controllers/day.controller");
const betController = require("../controllers/bet.controller");

router.get("/", secure.isAuthenticated, dayController.getAll);
router.get("/:id", secure.isAuthenticated, dayController.getById);

router.post("/", secure.isAuthenticated, secure.checkRole('admin'), dayController.createDay);
router.put("/:id", secure.isAuthenticated, dayController.updateDay);

router.delete("/:id", secure.isAuthenticated, dayController.delete);
router.delete("/", secure.isAuthenticated, dayController.deleteAll);

/* --------- BETS ROUTES ---------- */

router.get("/:id/bets",secure.isAuthenticated, betController.getAll);
router.get("/:id/bets/:id",secure.isAuthenticated, betController.getById);
router.post("/:id/bets/user",secure.isAuthenticated, betController.getByUserId);

router.post("/:id/bets",secure.isAuthenticated, betController.doBet);
router.post("/:id/bets/check",secure.isAuthenticated, betController.checkBets);

router.delete("/:id/bets/:id",secure.isAuthenticated, betController.delete);
router.delete("/:id/bets/", secure.isAuthenticated, betController.deleteAll);

module.exports = router;
