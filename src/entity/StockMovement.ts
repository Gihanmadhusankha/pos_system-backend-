import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enum/status";
import { MovementType } from "../enum/movementType";
import { Product } from "./Product";
@Entity("stock_movement")
export class StockMovement {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column({ type: "enum", enum: Status, default: Status.ONLINE })
    status!: Status;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

    @Column({ type: "enum", enum: MovementType })
    movementType!: MovementType;

    @JoinColumn({ name: "product_id" })
    @ManyToOne(() => Product, (product) => product.stockMovement)
    product!: Product;
}