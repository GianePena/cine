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


