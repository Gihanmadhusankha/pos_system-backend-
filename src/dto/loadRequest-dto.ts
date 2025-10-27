export class loadRequestDTO{
   private id?:number;
   private name?:string;

    public getId(): number {
        return this.id;
    }

    public setId(id?: number): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name?: string): void {
        this.name = name;
    }


    public fillViaRequest(body:any){
        this.id=body.id;
        this.name=body.name;

    }
}