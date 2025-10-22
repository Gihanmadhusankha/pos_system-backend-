export class UserResponse{
    
    private name:string;


    

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public fillViaRequest(body:any){
        
        this.name=body.name;
    }
}