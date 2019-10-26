const express = require("express");
const router = express.Router();
const secure = require("../middlewares/auth.middleware");
const dayController = require("../controllers/day.controller");
const betController = require("../controllers/bet.controller");

router.get("/", dayController.getAll);
router.get("/:id", dayController.getById);

router.post("/", dayController.createDay);
router.put("/:id", dayController.updateDay);

router.delete("/:id", dayController.delete);
router.delete("/", dayController.deleteAll);

/* --------- BETS ROUTES ---------- */

router.get("/:id/bets", betController.getAll);
router.get("/:id/bets/:id", betController.getById);

router.post("/:id/bets", betController.doBet);
router.post("/:id/bets/check", betController.checkBets);

router.delete("/:id/bets/:id", betController.delete);
router.delete("/:id/bets/", betController.deleteAll);

module.exports = router;
