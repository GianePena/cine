import passport from "passport"
//PASSPORT-LOCAL --> estrategia
import local from "passport-local"
//PASSPORT GITHUB --> estrategia
import github from "passport-github2"
//PASSPORT JWT 
import passportJWT from "passport-jwt"
import jwt from "jsonwebtoken"

import { config } from "./config.js"
import { UserManagerMONGO } from "../DAO/userManagerMONGO.js"
import { generaHash, validarPasword } from "../utils.js"
const userManager = new UserManagerMONGO



function buscarToken(req) {
    let token = null
    if (req.cookies["userCookie"]) {
        token = req.cookies["userCookie"]
    }
    return token
}

//PASO 1

export const initPassport = () => {
    //ESTRATEGIA DE LOGIN -> PASSPORT-GITHUB
    passport.use(
        "github",
        new github.Strategy({

            clientID: config.CLIENT_ID_GITHUB,
            clientSecret: config.CLIENT_SECRET_GITHUB,
            callbackURL: config.CALLBACK_URL_GITHUB
        },
            async (tokenAcesso, tokenRefresh, profile, done) => {
                try {
                    //console.log(profile); //SE VEN TODAS LAS PROP DEL PROFILE
                    let name = profile._json.name
                    let email = profile._json.email
                    if (!name || !email) {
                        return done(null, false)
                    }
                    let user = await userManager.getBy({ email })
                    if (!user) {
                        user = await userManager.createUser({ name, email, profile })
                    }
                    const token = jwt.sign({ email: user.email }, config.JWT_SECRET, { expiresIn: '1h' });
                    return done(null, token)
                } catch (error) {
                    return done(error)
                }
            }
        )//DENTRO DEL PROFILE HAY UNA PROP _JSON DE DONDE PODEMOS SACAR LOS DATOS PARA CREAR EL USUARIO
    )
    passport.use(
        "registro",
        new local.Strategy({
            usernameField: "email",
            passReqToCallback: true
        },
            async (req, username, password, done) => {
                try {
                    let { firstName, lastName, age } = req.body
                    if (!firstName || !lastName || !age) {
                        return done(null, false)
                    }
                    const userExistente = await userManager.getBy({ email: username })
                    if (userExistente) {
                        return done(null, false)
                    }
                    let rol = "user"
                    if (username === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
                        rol = "admin"
                    }
                    password = generaHash(password)
                    let newUser = await userManager.createUser({ firstName, lastName, email: username, age, password, rol })
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
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
                    return done(null, user)
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
            async (token, done) => {
                try {
                    const user = await userManager.getBy({ email: token.email })
                    if (!user) {
                        return (null, false, { message: "Token inexistente" })
                    }
                    return done(null, token)
                }
                catch (error) {
                    return done(error)
                }
            }
        )
    )

}



