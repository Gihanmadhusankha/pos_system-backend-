
import { SearchDto } from "./search-dto";

export class CommonPaginationDto extends SearchDto {
    private status: boolean | string;


    public fillViaRequest(body: any) {
        this.status = body.status;
        this.SearchfillViaRequest(body);
    }

    public isStatus(): boolean | string {
        return this.status;
    }

    public setStatus(status: boolean | string): void {
        this.status = status;
    }



}