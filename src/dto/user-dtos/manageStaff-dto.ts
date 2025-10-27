import { IsBoolean, IsNotEmpty } from "class-validator"
import { CrudDto } from "../crud-dto";
import { UserRole } from "../../enum/userRole";

export class ManageStaffRequest extends CrudDto {

    private name: string;
    private email: string;
    private password: string;
    private userId: number;
    private role: UserRole.STAFF;


    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getUserId?(): number {
        return this.userId;
    }

    public setUserId?(userId?: number): void {
        this.userId = userId;
    }

    public getRole(): UserRole.STAFF {
        return this.role;
    }

    public setRole(role: UserRole.STAFF): void {
        this.role = role;
    }




    public fillViaRequest(body: any) {
        this.name = body.name;
        this.email = body.email;
        this.password = body.password;
        this.userId = body.userId;
        this.role = body.role;
        this.crudFillViaRequest(body);
    }
}

