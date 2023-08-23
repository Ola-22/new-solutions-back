const express = require("express")
const { createEmployee, getAllEmployee, getSingleEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeCtrl")
const { authMiddleware } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/", authMiddleware, createEmployee)
router.get("/", getAllEmployee)
router.get("/:id", authMiddleware, getSingleEmployee)
router.put("/:id", authMiddleware, updateEmployee)
router.delete("/:id", authMiddleware, deleteEmployee)

module.exports = router