import { UserRole } from "../../enum/userRole";

export class RegisterRequestDto {

    private name:string;
    private email:string;
    private password:string;
    private role:UserRole.STAFF;
    
     

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

    public getRole(): UserRole.STAFF {
        return this.role;
    }

    public setRole(role: UserRole.STAFF): void {
        this.role = role;
    }


    public fillViaRequest(body:any){
    
        this.name=body.name;
        this.email=body.email;
        this.password=body.password;
        this.role=body.role;
        
    }

    
}




