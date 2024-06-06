//BCRYPT
import bcrypt from "bcrypt"
export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validarPasword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash)


//CUSTOM PASSPORT CALL
import passport from "passport"
export const passportCall = (estrategia) => {
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err) }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ error: info.message ? info.message : info.toString() })
            }
            req.user = user;
            return next()
        })(req, res, next);
    }
}



