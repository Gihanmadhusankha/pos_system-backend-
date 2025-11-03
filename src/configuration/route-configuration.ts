import express from "express";

var systemRoutes = require("../routes/systemRoutes");
var authRoutes = require("../routes/authRoutes");
var productRoutes = require("../routes/productRoutes");
var orderRoutes = require("../routes/orderRoutes");
var staffRoutes = require("../routes/staffRoutes");
var customerRoutes = require("../routes/customerRoutes");

export class RouteConfiguration {
  configRoutes(app: express.Application) {
    app.use("/api/system", systemRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/product", productRoutes);
    app.use("/api/order", orderRoutes);
    app.use("/api/user", staffRoutes);
    app.use("/api/customer", customerRoutes);
  }
}
