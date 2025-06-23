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
const validate = require("../middleware/validation");

// Schémas de validation
const {
  createCommentaireSchema,
  updateCommentaireSchema,
} = require("../validations/commentaireValidation");

router
  .route("/")
  .get(getCommentaires)
  .post(protect, validate(createCommentaireSchema), addCommentaire);

router
  .route("/:id")
  .put(protect, validate(updateCommentaireSchema), updateCommentaire)
  .delete(protect, deleteCommentaire);

module.exports = router;
