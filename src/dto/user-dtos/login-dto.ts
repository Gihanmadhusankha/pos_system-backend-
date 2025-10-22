export class LoginRequestDto {
  private email: string;
  private password: string;

  public fillViaRequest(body: any){
    this.email = body.email;
    this.password = body.password;
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

}


