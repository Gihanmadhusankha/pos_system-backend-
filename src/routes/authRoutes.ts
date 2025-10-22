import express, { Router } from "express";
var authController = require("../controllers/authController");
const router: Router = express.Router();

router.post("/register",authController.register);
router.post("/login",authController.login);
router.get("/refresh", authController.refresh);

module.exports = router;


