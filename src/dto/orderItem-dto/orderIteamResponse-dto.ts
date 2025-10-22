export class OrderItemResponseDTO {
    private productId: number;
    private productName: string;
    private quantity: number;
    private unitPrice: number;


    public getProductId(): number {
        return this.productId;
    }

    public setProductId(productId: number): void {
        this.productId = productId;
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

    public getUnitPrice(): number {
        return this.unitPrice;
    }

    public setUnitPrice(unitPrice: number): void {
        this.unitPrice = unitPrice;
    }
    public fillViaRequest(body: any) {
        this.productId = body.productId;
        this.productName = body.productName;
        this.quantity = body.quantity;
        this.unitPrice = body.unitPrice;
    }
}