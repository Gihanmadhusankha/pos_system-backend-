import { UserRole } from "../../enum/userRole";

export class LoginUserInfo {
    private userId: number;
    private email: string;
    private role: UserRole;
    private jwtToken: any;
    private refreshToken: any;

    fillViaObject(userObj: any) {
        this.userId = userObj.userId;
        this.email = userObj.email;
        this.role = userObj.role;
        this.jwtToken = userObj.jwtToken ? userObj.jwtToken : null;
    }

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getRole(): UserRole {
        return this.role;
    }

    public setRole(role: UserRole): void {
        this.role = role;
    }

    public getJwtToken(): any {
        return this.jwtToken;
    }

    public setJwtToken(jwtToken: any): void {
        this.jwtToken = jwtToken;
    }

    public getRefreshToken(): any {
        return this.refreshToken;
    }

    public setRefreshToken(refreshToken: any): void {
        this.refreshToken = refreshToken;
    }

}