const express = require("express");
const {
  getRecettes,
  getRecette,
  createRecette,
  updateRecette,
  deleteRecette,
  addNote,
  getRecettesPopulaires,
  getRecettesRecentes,
  ajouterFavori,
  retirerFavori,
} = require("../controllers/recettes");

// Middleware
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const validate = require("../middleware/validation");

// Schémas de validation
const {
  createRecetteSchema,
  updateRecetteSchema,
  addNoteSchema,
} = require("../validations/recetteValidation");

// Inclure d'autres routeurs
const commentaireRouter = require("./commentaires");

const router = express.Router();

// Re-router vers d'autres routeurs
router.use("/:recetteId/commentaires", commentaireRouter);

// Routes spéciales
router.get("/populaires", getRecettesPopulaires);
router.get("/recentes", getRecettesRecentes);

// Routes pour les favoris
router.post("/:id/favoris", protect, ajouterFavori);
router.delete("/:id/favoris", protect, retirerFavori);

// Routes pour les notes
router.post("/:id/notes", protect, validate(addNoteSchema), addNote);

// Routes principales
router
  .route("/")
  .get(getRecettes)
  .post(
    protect,
    upload.single("image"),
    validate(createRecetteSchema),
    createRecette
  );

router
  .route("/:id")
  .get(getRecette)
  .put(
    protect,
    upload.single("image"),
    validate(updateRecetteSchema),
    updateRecette
  )
  .delete(protect, deleteRecette);

module.exports = router;
