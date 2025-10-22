import { PaginationDto } from "./pagination-dto";

export class SearchDto extends PaginationDto{
    
    private searchText: string;

    public SearchfillViaRequest(body: any) {
        this.searchText = body.searchText;
        this.PaginationFillViaRequest(body);
    }

    public getSearchText(): string {
        return this.searchText;
    }

    public setSearchText(searchText: string): void {
        this.searchText = searchText;
    }

  }
  