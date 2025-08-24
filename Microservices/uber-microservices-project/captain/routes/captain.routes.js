const express = require("express");
const {
  registerController,
  login,
  profile,
  logout,
  toggleAvailability,
  requestNewRide,
} = require("../controllers/captain.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", authMiddleware.captainAuth, profile);
router.get("/new-ride", authMiddleware.captainAuth, requestNewRide);

router.patch(
  "/toggle-availability",
  authMiddleware.captainAuth,
  toggleAvailability
);

// router.get(
//   "/accepted-ride",
//   authMiddleware.captainAuth,
//   captainController.acceptedRide
// );

module.exports = router;
