
import bcrypt from "bcrypt"
export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validarPasword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash)



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

import { cartModelo } from "../DAO/models/cartModelo.js"

export const amount = async (cid) => {
    const cart = await cartModelo.findById(cid).populate('products.product');
    if (!cart) throw new Error('Cart not found');
    let total = cart.products.reduce((acum, item) => {
        return acum + (item.product.price * item.quantity)
    }, 0)
    return total
}




export const calcularStock = (product) => {
    let insufficientStock = [];
    if (product.stock < p.quantity) {
        insufficientStock.push({
            productId: p.product,
            stockDisponible: product.stock,
            cantidadRequrida: p.quantity
        });
    }
    if (insufficientStock.length > 0) {
        console.log(insufficientStock);
        throw new Error('Stock insuficiente para algunos productos ', {
            insufficientStock
        });
    }
}
