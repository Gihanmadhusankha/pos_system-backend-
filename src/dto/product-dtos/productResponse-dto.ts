export class ProductResponse {
    private productId: number;
    private name: string;
    private price: number;
    private stock: number;
    private IsActive: boolean;

    public getProductId(): number {
        return this.productId;
    }

    public setProductId(productId: number): void {
        this.productId = productId;
    }

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

    public isIsActive(): boolean {
        return this.IsActive;
    }

    public setIsActive(IsActive: boolean): void {
        this.IsActive = IsActive;
    }


    public fillViaRequest(body: any) {
        this.productId = body.productId;
        this.name = body.name;
        this.price = body.price;
        this.stock = body.stock;
        this.IsActive = body.IsActive;
    }

}