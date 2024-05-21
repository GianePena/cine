import passport from "passport"
//PASSPORT-LOCAL --> estrategia
import local from "passport-local"
//PASSPORT GITHUB --> estrategia
import github from "passport-github2"

import { UserManagerMONGO } from "../dao/userManagerMONGO.js"
import { generaHash, validarPasword } from "../utils.js"
const userManager = new UserManagerMONGO


//PASO 1

export const initPassport = () => {
    passport.use(
        "github",
        new github.Strategy({
            clientID: "Iv23ctPhpl2fqt9jYBQc",
            clientSecret: "5f50692752184bf95ac119bfe54d281219688417",
            callbackURL: "http://localhost:3000/user/callbackGithub "
        },
            async (tokenAcesso, tokenRefresh, profile, done) => {
                try {
                    console.log(profile); //SE VEN TODAS LAS PROP DEL PROFILE
                    let name = profile._json.name
                    let email = profile._json.email
                    if (!name || !email) {
                        return done(null, false)
                    }
                    let user = await userManager.getBy({ email })
                    if (!user) {
                        let user = await userManager.createUser({ name, email, profile })
                        return done(null, user)
                    }
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
                    let { name } = req.body
                    if (!name) {
                        return done(null, false)
                    }
                    const userExistente = await userManager.getBy({ email: username })
                    if (userExistente) {
                        return done(null, false)
                    }
                    password = generaHash(password)
                    let newUser = await userManager.createUser({ name, email: username, password, rol: "usuario" })
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
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userManager.getBy({ _id: id });
        return done(null, user);
    });

}


