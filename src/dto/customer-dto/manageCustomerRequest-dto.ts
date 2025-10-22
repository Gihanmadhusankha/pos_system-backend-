import { CrudDto } from "../crud-dto";

export class ManageCustomerRequest extends CrudDto {

    private customerId: number;
    private name: string;
    private email: string
    private phoneNumber: number;
    private address: string;



    public getCustomerId(): number {
        return this.customerId;
    }

    public setCustomerId(customerId: number): void {
        this.customerId = customerId;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPhoneNumber(): number {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: number): void {
        this.phoneNumber = phoneNumber;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public fillViaRequest(body: any) {
        this.customerId = body.customerId;
        this.name = body.name;
        this.email = body.email;
        this.phoneNumber = body.phoneNumber;
        this.address = body.address;
        this.crudFillViaRequest(body);

    }
}