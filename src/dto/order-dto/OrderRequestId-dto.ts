export class orderRequest {
    private orderId: number;

    public getOrderId(): number {
        return this.orderId;
    }

    public setOrderId(orderId: number): void {
        this.orderId = orderId;
    }


    public fillViaRequest(body: any) {
        this.orderId = body.orderId;
    }

}

