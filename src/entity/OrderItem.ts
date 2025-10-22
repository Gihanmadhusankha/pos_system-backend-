import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enum/status";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity('order_items')

export class OrderItem {
        @PrimaryGeneratedColumn()
        orderItemId!: number;

        @Column()
        quantity!: number;

        @Column()
        unitPrice!: number;

        @Column({ type: "enum", enum: Status, default: Status.ONLINE })
        status!: Status;

        @CreateDateColumn({ type: "timestamp" })
        created_at!: Date;

        @UpdateDateColumn({ type: "timestamp" })
        updated_at!: Date;

        @JoinColumn({ name: "order_id" })
        @ManyToOne(() => Order, (order) => order.orderItem)
        order!: Order;

        @JoinColumn({ name: "product_id" })
        @ManyToOne(() => Product, { eager: true })
        product!: Product;


}