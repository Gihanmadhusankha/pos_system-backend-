import { UserRole } from "../../enum/userRole";

export class UserDto {
    private userId: number;
    private role: UserRole;
    private jwtToken: string;
    private refreshToken: string;

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

    public getRole(): UserRole {
        return this.role;
    }

    public setRole(role: UserRole): void {
        this.role = role;
    }

    public getJwtToken(): string {
        return this.jwtToken;
    }

    public setJwtToken(jwtToken: string): void {
        this.jwtToken = jwtToken;
    }

    public getRefreshToken(): string {
        return this.refreshToken;
    }

    public setRefreshToken(refreshToken: string): void {
        this.refreshToken = refreshToken;
    }

}