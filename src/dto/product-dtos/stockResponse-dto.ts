import { MovementType } from "../../enum/movementType";

export class StockResponse{
    private id:number;
    private productName:string;
    private quantity:number;
    private date:Date;
    private type:MovementType;

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getProductName(): string {
        return this.productName;
    }

    public setProductName(productName: string): void {
        this.productName = productName;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    public getDate(): Date {
        return this.date;
    }

    public setDate(date: Date): void {
        this.date = date;
    }

    public getType(): MovementType {
        return this.type;
    }

    public setType(type: MovementType): void {
        this.type = type;
    }


    public fillViaRequest(body:any){
        this.id=body.id;
        this.productName=body.productName;
        this.quantity=body.quantity;
        this.date=body.date;
        this.type=body.type;
    }
}