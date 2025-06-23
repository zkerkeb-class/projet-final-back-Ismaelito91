const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");

const router = express.Router();

// Middleware de protection des routes
const { protect } = require("../middleware/auth");

// Middleware de validation
const validate = require("../middleware/validation");

// Schémas de validation
const {
  registerSchema,
  loginSchema,
  updateDetailsSchema,
  updatePasswordSchema,
} = require("../validations/authValidation");

// Routes publiques
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Routes protégées
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put(
  "/updatedetails",
  protect,
  validate(updateDetailsSchema),
  updateDetails
);
router.put(
  "/updatepassword",
  protect,
  validate(updatePasswordSchema),
  updatePassword
);

module.exports = router;
