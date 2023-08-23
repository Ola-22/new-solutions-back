const express = require("express")

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const {
    createUser,
    loginUserCtrl,
    getallUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
} = require("../controllers/userCtrl")
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUserCtrl)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logout)
router.get("/users", getallUsers)

router.get("/:id", authMiddleware, isAdmin, getUser)
router.delete("/:id", deleteUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports = router