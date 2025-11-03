import { IsBoolean, IsNotEmpty } from "class-validator"
import { CrudDto } from "../crud-dto";

export class ManagaProductRequest extends CrudDto {

    private name: string;
    private price: number;
    private stock: number;
    private productId: number;
    private IsActive: boolean


    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

   
    public getPrice(): number {
        return this.price;
    }

    public setPrice(price: number): void {
        this.price = price;
    }

    public getStock(): number {
        return this.stock;
    }

    public setStock(stock: number): void {
        this.stock = stock;
    }

    public getProductId(): number {
        return this.productId;
    }

    public setProductId(productId: number): void {
        this.productId = productId;
    }

    public isIsActive(): boolean {
        return this.IsActive;
    }

    public setIsActive(IsActive: boolean): void {
        this.IsActive = IsActive;
    }

    public fillViaRequest(body: any) {
        this.name = body.name;
        this.price = body.price;
        this.stock = body.stock;
        this.productId = body.productId;
        this.IsActive = body.IsActive;
        this.crudFillViaRequest(body);
    }
}

