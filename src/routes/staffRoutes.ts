import express, { Router } from "express";
var staffController = require("../controllers/staffController");

const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();

router.use(auth);


router.post("/manage",staffController.manageStaff);
router.post("/list",staffController.staffList);

module.exports = router;
