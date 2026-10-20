const express = require("express");
const router = express.Router();
const { register, login, getMe, getAllStudents } = require("../controllers/authController");
const { authHandler, allowRoles } = require("../middleware/authHandler");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authHandler, getMe);
router.get("/students", authHandler, allowRoles("admin"), getAllStudents);

module.exports = router;
