import { TIPOS_ERRORS } from "../utils/Errors.js"


export const errorHandler = () => {
    const errorResponse = {
        error: err.name,
        message: err.message,
        code: err.code
    };

    switch (err.code) {
        case TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS:
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json(errorResponse)
            break;
        case TIPOS_ERRORS.ERROR_AUTENTICACION:
            res.setHeader('Content-Type', 'application/json');
            res.status(401).json(errorResponse)
            break;
        case TIPOS_ERRORS.ERROR_AUTORIZACION:
            res.setHeader('Content-Type', 'application/json');
            res.status(403).json(errorResponse)
            break;
        case TIPOS_ERRORS.NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json(errorResponse)
            break;
        default:
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json(errorResponse)
            break;
    }
}