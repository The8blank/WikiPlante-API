// Plante.controller.js

// Importez les modules nécessaires
const db = require("../models");
const fs = require("fs");

// Fonction de contrôleur pour créer une plante
exports.createPlante = async (req, res, next) => {
  try {
    const userFromToken = res.locals.user;
    const {
      nom_commun,
      genre,
      espece,
      sous_espece_cultivar,
      famille,
      ordre,
      categorie,
      port,
      description,
    } = req.body;
    // Créer une nouvelle plante dans la base de données
    const plante = await db.Plantes.create({
      userId: userFromToken.id,
      nom_commun,
      genre,
      espece,
      sous_espece_cultivar,
      famille,
      ordre,
      categorie,
      port,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Plante cree",
      data: { plante: plante },
    });
  } catch (err) {
    next(err);
  }
};

// Fonction de contrôleur pour obtenir une seule plante par son identifiant
exports.getOnePlante = async (req, res, next) => {
  try {
    const id = req.params.id;
    // Rechercher la plante dans la base de données
    const plante = await db.Plantes.findByPk(id, {
      include: "images",
    });
    if (!plante) {
      return res.status(404).json({
        success: false,
        message: "Plante introuvable",
      });
    }
    res.status(200).json({
      success: true,
      plante: plante,
    });
  } catch (err) {
    next(err);
  }
};

// Fonction de contrôleur pour obtenir toutes les plantes
exports.getAllPlantes = async (req, res, next) => {
  try {
    // Rechercher toutes les plantes dans la base de données
    const plantes = await db.Plantes.findAll({
      include: "images",
    });
    res.status(200).json({
      success: true,
      plantes: plantes,
    });
  } catch (err) {
    next(err);
  }
};

// Fonction de contrôleur pour mettre à jour une plante
exports.updatePlante = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userFromToken = res.locals.user;
    // Récupérer les données mises à jour de la plante à partir du corps de la requête
    const {
      nom_commun,
      genre,
      espece,
      sous_espece_cultivar,
      famille,
      ordre,
      categorie,
      port,
      description,
    } = req.body;
    // Rechercher la plante à mettre à jour
    const plante = await db.Plantes.findByPk(id);
    if (!plante) {
      return res.status(404).json({
        success: false,
        message: "Plante introuvable",
      });
    }

    if (userFromToken.id != plante.userId && !userFromToken.isAdmin) {
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits",
      });
    }

    // Mettre à jour la plante dans la base de données
    await plante.update({
      nom_commun,
      genre,
      espece,
      sous_espece_cultivar,
      famille,
      ordre,
      categorie,
      port,
      description,
    });
    res.status(200).json({
      success: true,
      message: "Plante mis a jours",
      data: plante,
    });
  } catch (err) {
    next(err);
  }
};

// Fonction de contrôleur pour supprimer une plante
exports.deletePlante = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userFromToken = res.locals.user;

    const plante = await db.Plantes.findByPk(id, {
      include: "images", // Inclure les images associées à la plante
    });

    if (!plante)
      return res.status(404).json({
        success: false,
        message: "Plante introuvable.",
      });

    if (userFromToken.id != plante.userId && !userFromToken.isAdmin)
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits",
      });

    const imagesToUnlink = plante.images; // Utiliser la relation d'association pour obtenir les images associées à la plante

    // Supprimer les images associées à la plante
    for (const image of imagesToUnlink) {
      fs.unlink(image.url, (err) => {
        if (err) {
          next(err);
        }
      });
      await image.destroy();
    }

    await plante.destroy(); // Supprimer la plante

    res.status(200).json({
      success: true,
      message: "Plante supprime",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// Fonction de contrôleur pour ajouter une image à une plante
exports.addImage = async (req, res, next) => {
  const images = [];
  try {
    const planteId = req.params.planteId;
    const files = req.files;
    const userFromToken = res.locals.user;

    if (!files) {
      return res.status(400).json({
        success: false,
        message: "Image(s) is required",
      });
    }

    // Récupérer la plante avec les images ajoutées
    let plante = await db.Plantes.findByPk(planteId);

    if (!plante) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            next(err);
          }
        });
      });
      return res.status(404).json({
        success: false,
        message: "Plante Introuvable.",
      });
    }

    if (userFromToken.id != plante.userId && !userFromToken.isAdmin) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            next(err);
          }
        });
      });
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits.",
      });
    }

    for (const file of files) {
      const image = await db.ImagesPlantes.create({
        planteId,
        url: file.path, // Le chemin du fichier image
      });
      images.push(image);
    }

    res.status(201).json({
      success: true,
      message: "Image(s) ajoute",
      data: {
        plante,
        images,
      },
    });
  } catch (err) {
    // Supprimer les fichiers d'image téléchargés en cas d'erreur
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            next(err);
          }
        });
      });

      if (images.length > 0) {
        images.forEach((image) => {
          image.destroy();
        });
      }
    }
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const planteId = req.params.planteId;
    const imageId = req.params.imageId;
    const userFromToken = res.locals.user;

    const plante = await db.Plantes.findByPk(planteId);

    if (!plante)
      return res.status(404).json({
        success: false,
        message: "Plante Introuvable.",
      });

    if (userFromToken.id != plante.userId && !userFromToken.isAdmin) {
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits.",
      });
    }

    // Obtenir le chemin du fichier image à partir de la base de données
    const image = await db.ImagesPlantes.findOne({
      where: { id: imageId, planteId },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image introuvable",
      });
    }

    // Supprimer l'image de la base de données
    await db.ImagesPlantes.destroy({
      where: { id: imageId, planteId },
    });

    // Supprimer le fichier image du serveur
    fs.unlink(image.url, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: "Image supprime",
        data: {},
      });
    });
  } catch (err) {
    next(err);
  }
};
