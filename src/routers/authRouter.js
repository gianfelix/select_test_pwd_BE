const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const authController = require("../controller/authControllers");

router.post("/login", authController.login);
router.post("/auth", verifyToken, authController.registerEmployee);
router.patch("/auth",verifyToken, authController.updateRegister);
router.get("/role", authController.getRole);
router.get("/auth", authController.getAllUsers);

module.exports = router;
