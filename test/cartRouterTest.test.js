/*import mongoose, { isValidObjectId } from "mongoose"
import { afterEach, before, describe, it } from "mocha"
import { assert, expect } from "chai"
import supertest from "supertest"
import { config } from "../src/config/config.js"
import jwt from "jsonwebtoken"
import { logger } from "../src/utils/logger.js"
const requester = supertest("http://localhost:3000")


const connDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL,
            { dbName: config.DB_NAME }
        );
        logger.info(`Conexion de DB exitosa: DB online`)
    } catch (error) {
        logger.error("Error al conectar a DB")
    }
};
connDB();

describe("Pruebas router CART: get, getById, post, update y delete", function () {
    this.timeout(10000)
    let userCookie;
    let cookieValue;
    beforeEach(async function () {
        const mockUser = {
            first_name: "Giane",
            last_name: "test",
            email: "gianetest@gmail.com",
            age: 23,
            password: "123456",
            rol: "premium"
        }
        let { body, status } = await requester.post("/api/user/registro").send(mockUser);
        const mockUserLogin = {
            email: "gianetest@gmail.com",
            password: "123456"
        };
        let { header } = await requester.post("/api/user/login").send(mockUserLogin);
        let nombreCookie = header["set-cookie"][0].split("=")[0]
        cookieValue = header["set-cookie"][0].split("=")[1].split(";")[0]
        userCookie = jwt.verify(cookieValue, config.JWT_SECRET)
    })
    afterEach(async function () {
        await mongoose.connection.collection("users").deleteMany({ email: "gianetest@gmail.com" })

    })
    it("Prueba GET carts:  la ruta /api/cart/ TRAE A TODOS LOS CART CREADOS ", async function () {
        let { body, status } = await requester.get("/api/cart")
        expect(status).to.equal(200)
        expect(Array.isArray(body)).to.be.true;
        expect(body[0]).to.have.property('products')
        expect(body[0].products[0]).to.have.property('quantity').to.be.a('number')
        expect(body[0].products[0]).to.have.property('product')
    })
    it("Pruebas GET cart BY ID : la ruta /api/cart/:cid  TRAE AL CART DEL ID INDICADO", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        let { body, status } = await requester.get(`/api/cart/${responseBody.body._id}`).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(200)
        expect(body).to.have.property('products')
        expect(isValidObjectId(body._id)).to.be.true
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    })
    it("Prueba POST cart SIN USER: la ruta /api/cart/ CREA UN NUEVO CART SIN USER", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let { body, status } = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(isValidObjectId(body._id)).to.be.true
        expect(body.products).that.is.an('array')
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    })
    it("Prueba POST cart con user: la ruta /api/cart/ CREA UN NUEVO CART ASOCIADO A UN USUARIO", async function () {
        let uid = userCookie._id
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ],
            "uid": uid
        }
        let { body, status } = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(isValidObjectId(body._id)).to.be.true
        expect(body.products).that.is.an('array')
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    });
    it("Prueba POST cart: ruta /api/cart/addProducts/:cid/products AÑADE UN PRODUCTO AL CART ", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        const mockAddProductCart = {
            "products": [
                {
                    "product": "66b69d67816edbc03425d8e7",
                    "quantity": 4
                }
            ]
        }

        let { body, status } = await requester.put(`/api/cart/addProducts/${responseBody.body._id}/products`).send(mockAddProductCart).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(200)
        expect(body).to.have.property('_id')
        expect(body).to.have.property('products').that.is.an('array')
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')

    })
    it("Prueba PUT cart: ruta /api/cart/:cid MODIFICA EL CART COMPLETO ", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        const mockUpdateCart = {
            "products": [
                {
                    "product": "66b69d67816edbc03425d8e7",
                    "quantity": 4
                }
            ]
        }
        let { body, status } = await requester.put(`/api/cart/${responseBody.body._id}`).send(mockUpdateCart).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(isValidObjectId(body._id)).to.be.true
        expect(body).to.have.property('products').that.is.an('array')
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    })
    it("Prueba UPDATE cart: ruta /api/cart/:cid/products/:pid MODIFICA LA CANTIDAD DE PRODUCTO", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69d67816edbc03425d8e7",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        const mockUpdateCart = { quantity: 4 }
        let { body, status } = await requester.put(`/api/cart/${responseBody.body._id}/products/${mockCart.products[0].product}`).send(mockUpdateCart).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(200)
        expect(isValidObjectId(body._id)).to.be.true
        expect(body.products[0].quantity).to.not.equal(mockCart.products[0].quantity)
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    })
    it("Prueba DELETE cart: /api/cart/:cid ELIMINA UN PRODUCO DEL CART", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69d67816edbc03425d8e7",
                    "quantity": 2
                },
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        let { body, status } = await requester.delete(`/api/cart/${responseBody.body._id}/product/${mockCart.products[0].product}`).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(body).to.not.equal(responseBody.body)
        expect(isValidObjectId(body._id)).to.be.true
        expect(body).to.have.property('products').that.is.an('array')
        expect(body.products[0]).to.have.property('quantity').to.be.a('number')
        expect(body.products[0]).to.have.property('product')
    })
    it("Prueba DELETE cart: ruta /api/cart/:cid ELIMINA TODOS LOS PRODUCTOS DEL CART ", async function () {
        const mockCart = {
            "products": [
                {
                    "product": "66b69d67816edbc03425d8e7",
                    "quantity": 10
                },
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ]
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        let { body, status } = await requester.delete(`/api/cart/${responseBody.body._id}`).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(body).to.have.property('products').that.is.an('array').to.be.empty
    })
    /*it("Prueba POST ticket: ruta /api/cart/:cid/purchase  FINALIZA LA COMPRA", async function () {
        let uid = userCookie._id
        const mockCart = {
            "products": [
                {
                    "product": "66b69c8b816edbc03425d8de",
                    "quantity": 1
                }
            ],
            "uid": uid
        }
        let responseBody = await requester.post(`/api/cart/`).send(mockCart).set("Cookie", `userCookie=${cookieValue}`)
        let { body, status } = await requester.post(`/api/cart/${responseBody.body._id}/purchase`).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(body.ticket.amount).to.be.a('number')
        expect(isValidObjectId(body.ticket._id)).to.be.true
        expect(body.ticket).to.have.property('purchaser')
        expect(body.ticket).to.have.property('purchase_datetime')
        expect(body.ticket).to.have.property('code')
    })
})
*/