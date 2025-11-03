import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enum/status";
import { OrderItem } from "./OrderItem";
import { StockMovement } from "./StockMovement";


@Entity("products")
export class Product {
    
    @PrimaryGeneratedColumn()
    productId!: number;

    @Column({ length: 100, name: "product_name", nullable: false })
    name!: string;

    

    @Column({ type: "int", nullable: false, default: 0 })
    price!: number;

    @Column({ type: "int", nullable: false, default: 0 })
    stock!: number;

    @Column({ type: "boolean", nullable: false, default: true })
    IsActive!: boolean;

    @Column({ type: "enum", enum: Status, default: Status.ONLINE })
    status!: Status;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @OneToMany(() => OrderItem, (order) => order.product)
    orderItems!: OrderItem[];

    @OneToMany(() => StockMovement, (stockMovement) => stockMovement.product)
    stockMovement!: StockMovement[];


}