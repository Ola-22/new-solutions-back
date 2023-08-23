const express = require("express")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { createSettings, getSettings, updateSettings } = require("../controllers/settingsCtrl")
const router = express.Router()

router.post("/", authMiddleware, createSettings)
router.get("/", getSettings)
router.put("/", authMiddleware, isAdmin, updateSettings)

module.exports = router