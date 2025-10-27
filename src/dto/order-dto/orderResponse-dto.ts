import { CustomerResponseDTO } from "../customer-dto/customerResponse-dto";
import { OrderItemResponseDTO } from "../orderItem-dto/orderIteamResponse-dto";
import { UserResponseDTO } from "../user-dtos/userResponse-dto";

export class OrderResponseDTO {
    private orderId: number;
    private orderNumber: string;
    private orderStatus: string;
    private total: number;
    private placedAt: Date;
    private customer: CustomerResponseDTO;
    private items: OrderItemResponseDTO[];
    private user: UserResponseDTO;


    public getOrderId(): number {
        return this.orderId;
    }

    public setOrderId(orderId: number): void {
        this.orderId = orderId;
    }

    public getOrderStatus(): string {
        return this.orderStatus;
    }

    public setOrderStatus(orderStatus: string): void {
        this.orderStatus = orderStatus;
    }

    public getTotal(): number {
        return this.total;
    }

    public setTotal(total: number): void {
        this.total = total;
    }

    public getPlacedAt(): Date {
        return this.placedAt;
    }

    public setPlacedAt(placedAt: Date): void {
        this.placedAt = placedAt;
    }

    public getCustomer(): CustomerResponseDTO {
        return this.customer;
    }

    public setCustomer(customer: CustomerResponseDTO): void {
        this.customer = customer;
    }

    public getItems(): OrderItemResponseDTO[] {
        return this.items;
    }

    public setItems(items: OrderItemResponseDTO[]): void {
        this.items = items;
    }

    public getUser(): UserResponseDTO {
        return this.user;
    }

    public setUser(user: UserResponseDTO): void {
        this.user = user;
    }
    public getOrderNumber(): string {
        return this.orderNumber;
    }

    public setOrderNumber(orderNumber: string): void {
        this.orderNumber = orderNumber;
    }

    public fillViaRequest(body: any) {
        this.orderId = body.orderId;
        this.orderNumber = body.orderNumber;
        this.orderStatus = body.orderStatus;
        this.total = body.total;
        this.placedAt = body.placedAt;
        this.customer = body.customer;
        this.items = body.items;
        this.user = body.user;
    }

}