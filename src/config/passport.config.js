import passport from "passport"

import local from "passport-local"

import github from "passport-github2"

import passportJWT from "passport-jwt"
import jwt from "jsonwebtoken"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "./config.js"
import { UserManagerMONGO } from "../DAO/userManagerMONGO.js"
import { generaHash, validarPasword } from "../utils/utils.js"
import { logger } from "../utils/logger.js"


const userManager = new UserManagerMONGO

function buscarToken(req) {
    let token = null;
    if (req.cookies && req.cookies["userCookie"]) {
        token = req.cookies["userCookie"];
        logger.info(`Token extraido: ${token}`)
    } else {
        logger.error("No se encontró la cookie 'userCookie' o no contiene un token")
    }
    return token;
}


export const initPassport = () => {
    passport.use(
        "github",
        new github.Strategy({
            clientID: config.CLIENT_ID_GITHUB,
            clientSecret: config.CLIENT_SECRET_GITHUB,
            callbackURL: config.CALLBACK_URL_GITHUB
        },
            async (tokenAcesso, tokenRefresh, profile, done) => {
                try {
                    let name = profile._json.name;
                    let email = profile._json.email;
                    if (!name || !email) {
                        return done(null, false, { message: "Datos insuficientes, no posee nombre o email en su cuenta de GitHub" });
                    }
                    let user = await userManager.getBy({ email });
                    let rol = "user";
                    if (!user) {
                        user = await userManager.createUser({ name, email, rol });
                    }
                    const token = jwt.sign({ email: user.email, rol: user.rol }, config.JWT_SECRET, { expiresIn: '1h' });
                    return done(null, { token, ...user.toObject() });
                } catch (error) {
                    return done(error);
                }
            })
    );
    passport.use(
        "registro",
        new local.Strategy({
            usernameField: "email",
            passReqToCallback: true
        },
            async (req, username, password, done) => {
                try {
                    let { first_name, last_name, age, cart, rol } = req.body;
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: "Faltan datos en el formulario" });
                    }
                    const userExistente = await userManager.getBy({ email: username });
                    if (username === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
                        rol = "admin";
                    }
                    if (userExistente && rol != "user") {
                        return done(null, false, { message: "Usuario existente, pruebe con otro email" });
                    }
                    const hashedPassword = generaHash(password);
                    if (cart) {
                        let newUser = await userManager.createUser({ first_name, last_name, email: username, age, password: hashedPassword, rol, cart })
                        return done(null, newUser);
                    }
                    else {
                        let newUser = await userManager.createUser({ first_name, last_name, email: username, age, password: hashedPassword, rol });
                        return done(null, newUser);
                    }
                } catch (error) {
                    return done(error);
                }
            })
    );
    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let user = await userManager.getBy({ email: username })
                    if (!user) {
                        return done(null, false)
                    }
                    if (!validarPasword(password, user.password)) {
                        return done(null, false)
                    }
                    return done(null, user.toObject())
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "jwt",
        new passportJWT.Strategy(
            {
                secretOrKey: config.JWT_SECRET,
                jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async (contenidoToken, done) => {
                try {
                    const user = await userManager.getBy({ email: contenidoToken.email })
                    if (!user) {
                        return (null, false, { message: "Token inexistente" })
                    }
                    return done(null, contenidoToken)
                }
                catch (error) {
                    return done(error)
                }
            }
        )
    )
}

