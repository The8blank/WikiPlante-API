const express = require("express");
const PlanteRouter = express.Router();

const {
  createPlante,
  getOnePlante,
  getAllPlantes,
  updatePlante,
  deletePlante,
  addImage,
  deleteImage,
} = require("./../controllers/Plante.controller");
const { requireAuth } = require("../middleware/auth.js");
const upload = require("../config/multer");

PlanteRouter.post("/", requireAuth, createPlante);
PlanteRouter.get("/:id", getOnePlante);
PlanteRouter.get("/", getAllPlantes);
PlanteRouter.put("/:id", requireAuth, updatePlante);
PlanteRouter.delete("/:id", requireAuth, deletePlante);

PlanteRouter.post("/:planteId/images", requireAuth, upload.any(), addImage);
PlanteRouter.delete("/:planteId/images/:imageId", requireAuth, deleteImage);

module.exports = PlanteRouter;
