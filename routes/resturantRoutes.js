const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createResturantController,
  getAllResturantController,
  getResturantByIdController,
  deleteResturantController,
} = require("../controllers/resturantController");

const router = express.Router();

//routes
// CRAETE RESTURANT || POST
router.post("/create", authMiddleware, createResturantController);

// GET ALL RESTURANTS || GET
router.get("/getAll", getAllResturantController);

// GET RESTURANT BY ID || GET
router.get("/get", getResturantByIdController);

// DELETE RESTURANT || DELETE
router.delete("/delete", authMiddleware, deleteResturantController);

module.exports = router;
