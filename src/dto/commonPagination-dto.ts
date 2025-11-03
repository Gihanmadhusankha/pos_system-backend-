
import { SearchDto } from "./search-dto";

export class CommonPaginationDto extends SearchDto {
    private status?: boolean | string;
    private fromDate?:Date;
    private toDate?:Date;

    public getFromDate(): Date {
        return this.fromDate;
    }

    public setFromDate(fromDate: Date): void {
        this.fromDate= fromDate;
    }

    public getToDate(): Date {
        return this.toDate;
    }

    public setToDate(toDate: Date): void {
        this.toDate = toDate;
    }
      public isStatus(): boolean | string {
        return this.status;
    }

    public setStatus(status: boolean | string): void {
        this.status = status;
    }

    


    public fillViaRequest(body: any) {
        this.status = body.status;
        this.fromDate=body.fromDate;
        this.toDate=body.toDate;
        this.SearchfillViaRequest(body);
    }

  



}