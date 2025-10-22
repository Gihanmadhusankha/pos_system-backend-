import { CreateCustomerDTO } from "../customer-dto/createCustomer-dto";
import { OrderItemDTO } from "../orderItem-dto/orderItem-dto";

export class CreateOrderDTO {
    private customer: CreateCustomerDTO;
    private items: OrderItemDTO[];

    public getCustomer(): CreateCustomerDTO {
        return this.customer;
    }

    public setCustomer(customer: CreateCustomerDTO): void {
        this.customer = customer;
    }

    public getItems(): OrderItemDTO[] {
        return this.items;
    }

    public setItems(items: OrderItemDTO[]): void {
        this.items = items;
    }
    public fillViaRequest(body: any) {
        this.customer = body.customer;
        this.items = body.items;
    }
}