export class UserResponseDTO {
    private userId: number;
    private name: string;
    private email: string;


    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

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

    public fillViaRequest(body: any) {
        this.userId = body.userId;
        this.name = body.name;
        this.email = body.email;
    }





}