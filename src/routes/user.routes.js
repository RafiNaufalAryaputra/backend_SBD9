const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const corsMiddleware = require("../middleware/cors.middleware");

router.use(corsMiddleware);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:email", userController.getUserByEmail);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/topUp", userController.topUpUser);

module.exports = router;
