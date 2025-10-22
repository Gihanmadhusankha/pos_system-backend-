import { ValidationStatus } from "../enum/validation-status";
import { ValidationType } from "../enum/validation-type";

export interface IValidation {
    code: ValidationType;
    type: ValidationStatus;
    msgParams: string[];
}