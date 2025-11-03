import { SearchDto } from "./search-dto";

export class loadRequestDTO {
    private id?: number;
    private searchName?:string;


    public getSearchName(): string {
        return this.searchName;
    }

    public setSearchName(searchName: string): void {
        this.searchName = searchName;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id?: number): void {
        this.id = id;
    }

    public fillViaRequest(body: any) {
        this.id = body.id;
        this.searchName=body.searchName ? body.searchName : body.searchText;

    }
}