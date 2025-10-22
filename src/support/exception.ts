export class exception extends Error{
    status:number;
    constructor(status:number,message:string){
        super(message);
        this.status=status;
    }
}
export class NotFoundException extends exception{
    constructor(message="Not Found"){
        super(404,message);
    }
}

export class BadRequestException extends exception{
    constructor(message="Bad Request"){
        super(400,message)
    }
}

export class UnauthorizedError extends exception {
  constructor(message = "Unauthorized") {
    super(401,message);
  }
}
