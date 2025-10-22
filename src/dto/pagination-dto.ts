export abstract class PaginationDto {
  private isReqPagination: boolean;
  private startIndex: number = 0;
  private maxResult: number = 0;

  PaginationFillViaRequest(body: any) {
    this.startIndex = body.startIndex;
    this.maxResult = body.maxResult;
    this.isReqPagination = body.isReqPagination;
  }

  public isIsReqPagination(): boolean {
    return this.isReqPagination;
  }

  public setIsReqPagination(isReqPagination: boolean): void {
    this.isReqPagination = isReqPagination;
  }

  public getStartIndex(): number {
    return this.startIndex;
  }

  public setStartIndex(startIndex: number): void {
    this.startIndex = startIndex;
  }

  public getMaxResult(): number {
    return this.maxResult;
  }

  public setMaxResult(maxResult: number): void {
    this.maxResult = maxResult;
  }
}
