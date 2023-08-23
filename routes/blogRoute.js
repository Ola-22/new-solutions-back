const express = require("express")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog } = require("../controllers/blogCtrl")
const router = express.Router()

router.post("/", authMiddleware, createBlog)
router.get("/", getAllBlog)
router.get("/:id", authMiddleware, getSingleBlog)
router.put("/:id", authMiddleware, updateBlog)
router.delete("/:id", authMiddleware, deleteBlog)

module.exports = router