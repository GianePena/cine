//METODO QUE PERMIOTE CREAR Y LANZAR ERRORES PERSONALIZADOS --> toma los argumentos pasadoe en el router
//SE PASA A LAS RUTAS 
//VER LOS ERRORES DE HEROE Y HACERLOS PARA CART Y PRODUCTS
import { TIPOS_ERRORS } from "./Errors.js"

export class CustomError {
    static createError(name = "Error", message, code = TIPOS_ERRORS.ERROR_SERVIDOR_INTERNO) {
        const error = new Error(message);
        error.name = name;
        error.code = code;

        throw error
    }
}
//clase.metodo(name,causa, mensaje, status code)
//ROUTER-->CustomError.createError("Argumento name faltante", argumentosHeroe(req.body), "Complete la propiedad name", TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
//name = toma el valor que llega al router--> "Argumento name faltante" o por deteto "error"
//cause= toma el valor del erroresHeroures.js
//mensaje es pasado por el router--> "Complete la propiedad name"
//code= toma los codigos del diccionario o por defecto TIPOS_ERROR.ARGUMENTOS_INVALIDOS
