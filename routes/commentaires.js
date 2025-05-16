const express = require("express");
const {
  getCommentaires,
  addCommentaire,
  updateCommentaire,
  deleteCommentaire,
} = require("../controllers/commentaires");

const router = express.Router({ mergeParams: true });

// Middleware
const { protect } = require("../middleware/auth");

router.route("/").get(getCommentaires).post(protect, addCommentaire);

router
  .route("/:id")
  .put(protect, updateCommentaire)
  .delete(protect, deleteCommentaire);

module.exports = router;
