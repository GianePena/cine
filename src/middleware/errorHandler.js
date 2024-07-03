//CAPTURA Y PROCESSA LOS ERRORES 
//ESTE SE PASA A NIVEL DE APLICAION EN EL APP.JS AL FINAL DE TODAS LAS RUTAS --> app.use(errorHandler)
//se define al final de todas las rutas y middlewares y se encarga de capturar todos los errores que no se hayan manejado previamente, y proporciona respuestas estructuradas.

import { TIPOS_ERRORS } from "../utils/Errors.js"


export const errorHandler = (err, req, res, next) => {
    switch (err.code) {
        case TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS:
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Error tipo de dato incorrecto: ${err.message}. ${err.cause}` });
        case TIPOS_ERRORS.ERROR_AUTENTICACION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Error de autenticación. Credenciales inválidas:${err.message}` });
        case TIPOS_ERRORS.ERROR_AUTORIZACION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `Error de autorización. No tiene permiso para acceder a este recurso:${err.message}` })
        case TIPOS_ERRORS.NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Not Found:${err.message} ` })
        default:
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error - contacte al administrador: ${err.message}` })
    }

}