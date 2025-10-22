export class OrderItemDTO {

    private productId: number;
    private quantity: number;


    public fillViaObject(body: any) {
        this.productId = body.productId;
        this.quantity = body.quantity;
    }
    public getProductId(): number {
        return this.productId;
    }

    public setProductId(productId: number): void {
        this.productId = productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public setQuantity(quantity: number): void {
        this.quantity = quantity;
    }


}