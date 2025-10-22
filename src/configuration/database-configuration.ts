import { DataSource } from "typeorm";
import { EnvironmentConfiguration } from "./environment-configuration";
import { User } from "../entity/User";
import { Customer } from "../entity/Customer";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { StockMovement } from "../entity/StockMovement";

const environmentConfiguration = new EnvironmentConfiguration();
const appConfig = environmentConfiguration.readAppConfiguration();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: appConfig.getHost(),
  port: appConfig.getDataBasePort(),
  username: appConfig.getUserName(),
  password: appConfig.getPassword(),
  database: appConfig.getDataBase(),
  synchronize: true,
  entities: [
    User, 
    Customer, 
    Order,
    OrderItem, 
    Product, 
    StockMovement
  ],
  logging: false,
});

export const ConnectToDatabase = async () => {
  try {
    const connection = await AppDataSource.initialize();
    console.log("Database connected !");
  } catch (error) {
    console.log(error);
    console.log("Database connection Failed !");
  }
};
