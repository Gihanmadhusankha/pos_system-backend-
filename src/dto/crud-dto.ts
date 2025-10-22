export abstract class CrudDto {
  private isNew: boolean;
  private isDelete: boolean;
  private isUpdate: boolean;

  public isIsUpdate(): boolean {
    return this.isUpdate;
  }

  public setIsUpdate(isUpdate: boolean): void {
    this.isUpdate = isUpdate;
  }


  crudFillViaRequest(reqBody: any) {
    this.isNew = reqBody.isNew;
    this.isUpdate = reqBody.isUpdate;
    this.isDelete = reqBody.isDelete;
  }

  public isIsNew(): boolean {
    return this.isNew;
  }

  public setIsNew(isNew: boolean): void {
    this.isNew = isNew;
  }

  public isIsDelete(): boolean {
    return this.isDelete;
  }

  public setIsDelete(isDelete: boolean): void {
    this.isDelete = isDelete;
  }
}
