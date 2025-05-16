const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserFavoris,
  updateAvatar,
} = require("../controllers/users");

const router = express.Router();

// Middleware
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Routes protégées par admin
router.route("/").get(protect, authorize("admin"), getUsers);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

// Routes publiques et protégées
router.get("/:id/profile", getUserProfile);
router.get("/:id/favoris", protect, getUserFavoris);
router.put("/:id/avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;
