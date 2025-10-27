import express, { Router } from "express";
var productController = require("../controllers/productController");
const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();

router.use(auth);

router.post("/manage", productController.manageProduct);
router.post("/list", productController.productList);
router.post("/stock", productController.stockList);

module.exports = router;