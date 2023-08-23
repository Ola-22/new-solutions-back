const express = require("express")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { createProject, getProjects, getSingleProject, updateProject, deleteProject } = require("../controllers/projectCtrl")
const router = express.Router()

router.post("/", authMiddleware, createProject)
router.get("/", getProjects)
router.get("/:id", getSingleProject)
router.put("/:id", authMiddleware, isAdmin, updateProject)
router.delete("/:id", authMiddleware, isAdmin, deleteProject)

module.exports = router