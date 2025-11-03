import express, { Router } from "express";
var orderController=require("../controllers/orderController");
const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();

router.use(auth);

router.post("/create",orderController.createOrder );
router.post("/orderId", orderController.getOrderById);
router.post("/list",orderController.getOrderList );
router.post("/paid",orderController. paidOrder);
router.post("/cancel", orderController.cancelOrder);
router.post("/load", orderController.loadOrder);



module.exports = router;