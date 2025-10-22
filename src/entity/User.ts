import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../enum/userRole";
import { Status } from "../enum/status";
import { Order } from "./Order";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn()
    userId!: number;

    @Column({ length: 100, name: "user_name", nullable: false })
    name!: string;

    @Column({ length: 150, name: "user_email", nullable: false, unique: true })
    email!: string;

    @Column({ length: 255, name: "user_password", nullable: false })
    password!: string;

    @Column({ type: "enum", enum: UserRole, nullable: false })
    role!: UserRole;

    @Column({ type: "enum", enum: Status, default: Status.ONLINE })
    status!: Status;

    @CreateDateColumn({ type: "timestamp" })
    created_at?: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at?: Date;

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];

}