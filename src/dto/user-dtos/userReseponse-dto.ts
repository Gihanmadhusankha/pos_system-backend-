export class UserResponse {
    userId!: number;
    name!: string;
    email!: string;

    public fillViaRequest(body: any) {
        this.userId = body.userId;
        this.name = body.name;
        this.email = body.email;
    }
    
    public getUserId():number{
       return  this.userId;
    }
    public setUserId():void{
        this.userId=this.userId;
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




}