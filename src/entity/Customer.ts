import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enum/status";
import { Order } from "./Order";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    customerId!: number;

    @Column({ length: 100, name: "customer_name", nullable: false })
    name!: string;

    @Column({ length: 150, name: "customer_email", nullable: false, unique: true })
    email!: string;

    @Column({  name: "customer_phone_number", nullable: false })
    phoneNumber!: number;

    @Column({ length: 150, name: "customer_address", nullable: false })
    address!: string;

    @Column({ type: "enum", enum: Status, default: Status.ONLINE })
    status!: Status;

    @OneToMany(() => Order, (order) => order.customer)
    order!: Order[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;

}