const mongoose = require("mongoose");

const CommentaireSchema = new mongoose.Schema({
  texte: {
    type: String,
    required: [true, "Le texte du commentaire est obligatoire"],
    trim: true,
    maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
  },
  recette: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recette",
    required: true,
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Commentaire", CommentaireSchema);
