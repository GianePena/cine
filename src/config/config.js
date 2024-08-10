import dotenv from "dotenv"
import { Command, Option } from "commander"

let programa = new Command()
programa.addOption(new Option("-m, --mode <modo>", "Mode de ejecución del script").choices(["dev", "prod"]).default("dev"))
programa.parse()
const argumentos = programa.opts()


const mode = argumentos.mode

dotenv.config({
    path: mode === "prod" ? "./src/.env.production" : "./src/.env.development",
    override: true

})
export const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    CALLBACK_URL_GITHUB: process.env.CALLBACK_URL_GITHUB,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    CONTRASEÑA_APLICACION_EMAIL: process.env.CONTRASEÑA_APLICACION_EMAIL,
    CODIGO_DE_RECURERACION_DE_PASSWORD: process.env.CODIGO_DE_RECURERACION_DE_PASSWORD
}