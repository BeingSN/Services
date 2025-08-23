const express = require("express");
const {
  registerController,
  login,
  profile,
  logout,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", authMiddleware.userAuth, profile);

// router.get(
//   "/accepted-ride",
//   authMiddleware.userAuth,
//   userController.acceptedRide
// );

module.exports = router;
