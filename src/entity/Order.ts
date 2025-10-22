import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { OrderStatus } from "../enum/orderStatus";
import { Status } from "../enum/status";
import { Customer } from "./Customer";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity("orders")
export class Order {

  @PrimaryGeneratedColumn()
  orderId!: number;

  @Column({ name: "order_number", nullable: false, unique: true })
  orderNumber!: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.DRAFT })
  orderStatus!: OrderStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total!: number;

  @Column({ type: "enum", enum: Status, default: Status.ONLINE })
  status!: Status;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @ManyToOne(() => Customer, (customer) => customer.order, { eager: true })
  @JoinColumn({ name: "customer_id" })
  customer!: Customer;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  orderItem!: OrderItem[];
}
