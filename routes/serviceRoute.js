const express = require("express")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { createService, getServices, getSingleService, updateService, deleteService } = require("../controllers/ServiceCtrl")
const router = express.Router()

router.post("/", authMiddleware, createService)
router.get("/", getServices)
router.get("/:id", getSingleService)
router.put("/:id", authMiddleware, isAdmin, updateService)
router.delete("/:id", authMiddleware, isAdmin, deleteService)

module.exports = router