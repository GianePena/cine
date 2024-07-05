
import { TIPOS_ERRORS } from "./Errors.js"

export class CustomError {
    static createError(name = "Error", message, code = TIPOS_ERRORS.ERROR_SERVIDOR_INTERNO) {
        const error = new Error(message);
        error.name = name;
        error.code = code;

        throw error
    }
}

