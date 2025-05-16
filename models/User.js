const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },
  prenom: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez fournir un email valide",
    ],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: "default-avatar.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  recettesFavorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recette",
    },
  ],
  dateInscription: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Crypter le mot de passe avant la sauvegarde
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour générer un token JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour ajouter une recette aux favoris
UserSchema.methods.ajouterFavori = function (recetteId) {
  if (!this.recettesFavorites.includes(recetteId)) {
    this.recettesFavorites.push(recetteId);
  }
};

// Méthode pour retirer une recette des favoris
UserSchema.methods.retirerFavori = function (recetteId) {
  this.recettesFavorites = this.recettesFavorites.filter(
    (id) => id.toString() !== recetteId.toString()
  );
};

module.exports = mongoose.model("User", UserSchema);
