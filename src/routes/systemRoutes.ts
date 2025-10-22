import express, { Router } from "express";
var systemController = require("../controllers/systemController");
const router: Router = express.Router();

router.get("/health", systemController.getSystemHealth);

module.exports = router;
