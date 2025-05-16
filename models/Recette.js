const mongoose = require("mongoose");

const RecetteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre est obligatoire"],
    trim: true,
    maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
  },
  description: {
    type: String,
    required: [true, "La description est obligatoire"],
    trim: true,
  },
  ingredients: [
    {
      nom: {
        type: String,
        required: true,
      },
      quantite: {
        type: String,
        required: true,
      },
      unite: {
        type: String,
        required: false,
      },
    },
  ],
  etapesPreparation: [
    {
      type: String,
      required: true,
    },
  ],
  tempsPreparation: {
    type: Number,
    required: true,
  },
  tempsCuisson: {
    type: Number,
    required: false,
  },
  portions: {
    type: Number,
    required: true,
  },
  difficulte: {
    type: String,
    enum: ["Facile", "Moyen", "Difficile"],
    default: "Moyen",
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    default: "default.jpg",
  },
  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: [
    {
      utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      valeur: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    },
  ],
  noteMoyenne: {
    type: Number,
    default: 0,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

// Méthode pour calculer la note moyenne
RecetteSchema.methods.calculerNoteMoyenne = function () {
  if (this.notes.length === 0) {
    this.noteMoyenne = 0;
    return;
  }

  const somme = this.notes.reduce((acc, note) => acc + note.valeur, 0);
  this.noteMoyenne = Math.round((somme / this.notes.length) * 10) / 10;
};

module.exports = mongoose.model("Recette", RecetteSchema);
