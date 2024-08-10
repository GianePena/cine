/*
import mongoose, { isValidObjectId } from "mongoose"
import { afterEach, before, describe, it } from "mocha"
import { assert, expect } from "chai"
import supertest from "supertest"
import { config } from "../src/config/config.js"
import { productModelo } from "../src/DAO/models/productModelo.js"
import jwt from "jsonwebtoken"
import { userModelo } from "../src/DAO/models/userModelo.js"
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


describe("Pruebas router Products: get, getById, post, update y delete", function () {
    this.timeout(10000);
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
        };
        let { body, status } = await requester.post("/user/registro").send(mockUser);
        const mockUserLogin = {
            email: "gianetest@gmail.com",
            password: "123456"
        };
        let { header } = await requester.post("/user/login").send(mockUserLogin);
        let nombreCookie = header["set-cookie"][0].split("=")[0]
        cookieValue = header["set-cookie"][0].split("=")[1].split(";")[0]
        userCookie = jwt.verify(cookieValue, config.JWT_SECRET)
    })
    afterEach(async function () {
        await mongoose.connection.collection("products").deleteMany({ title: "LA TRAMPA" })
    })
    it("Prueba GET products: /api/products/ TRAE A TODOS LOS PRODUCTS CREADOS ", async function () {
        let { body, status } = await requester.get("/api/products")
        expect(status).to.equal(200)
        expect(Array.isArray(body.docs)).to.be.true;
    })
    it("Prueba POST product: /api/products/ CREA UN PRODUCT", async function () {
        const mockProduct = {
            owner: userCookie.email,
            title: "LA TRAMPA",
            category: "Thriller",
            description: "Un padre y su hija adolescente asisten a un concierto de pop, donde se dan cuenta de que están en el centro de un evento oscuro y siniestro.",
            price: "5000",
            thumbnail: "https://static.cinemarkhoyts.com.ar/Images/Posters/4e002da7723fb0e44a98601716b3ec51.jpg?v=00002398",
            code: "783",
            stock: 5,
            status: true
        };
        let { body, header, status } = await requester.post("/api/products").send(mockProduct).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(201)
        expect(body).to.have.property('title')
        expect(body).to.have.property('category')
        expect(body).to.have.property('description')
        expect(body).to.have.property('price')
        expect(body).to.have.property('thumbnail')
        expect(body).to.have.property('stock')
        expect(body).to.have.property('_id')
        expect(isValidObjectId(body._id)).to.be.true
    })
    it("Prueba GET product BY ID: /api/products/:pid  TRAE AL PRODUCT DEL ID INDICADO", async function () {
        const mockProduct = {
            owner: userCookie.email,
            title: "LA TRAMPA",
            category: "Thriller",
            description: "Un padre y su hija adolescente asisten a un concierto de pop, donde se dan cuenta de que están en el centro de un evento oscuro y siniestro.",
            price: "5000",
            thumbnail: "https://static.cinemarkhoyts.com.ar/Images/Posters/4e002da7723fb0e44a98601716b3ec51.jpg?v=00002398",
            code: "783",
            stock: 5,
            status: true
        };

        let responseBody = await requester.post("/api/products").send(mockProduct).set("Cookie", `userCookie=${cookieValue}`)
        let { body, status } = await requester.get(`/api/products/${responseBody.body._id}`).set("Cookie", `userCookie=${cookieValue}`)
        expect(body).to.have.property('owner')
        expect(body).to.have.property('title')
        expect(body).to.have.property('category')
        expect(body).to.have.property('description')
        expect(body).to.have.property('price')
        expect(body).to.have.property('code')
        expect(body).to.have.property('stock')
        expect(body).to.have.property('_id')
    })
    it("Prueba PUT product: /api/products/:pid MODIFICA EL PRICE DEL PRODUCT INDICADO", async function () {
        const mockProduct = {
            owner: userCookie.email,
            title: "LA TRAMPA",
            category: "Thriller",
            description: "Un padre y su hija adolescente asisten a un concierto de pop, donde se dan cuenta de que están en el centro de un evento oscuro y siniestro.",
            price: "5000",
            thumbnail: "https://static.cinemarkhoyts.com.ar/Images/Posters/4e002da7723fb0e44a98601716b3ec51.jpg?v=00002398",
            code: "783",
            stock: 5,
            status: true
        };
        let responseBody = await requester.post("/api/products").send(mockProduct).set("Cookie", `userCookie=${cookieValue}`)
        let mockUpdateProduct = { email: userCookie.email, price: 1222 }
        let { body, status } = await requester.put(`/api/products/${responseBody.body._id}`).send(mockUpdateProduct).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(200)
        expect(body).to.exist
        expect(body).to.have.property('price').to.equal(mockUpdateProduct.price)
    })
    it("Prueba DELETE product: /api/products/:pid  ELIMINA EL PRODUCT", async function () {
        const mockProduct = {
            owner: userCookie.email,
            title: "LA TRAMPA",
            category: "Thriller",
            description: "Un padre y su hija adolescente asisten a un concierto de pop, donde se dan cuenta de que están en el centro de un evento oscuro y siniestro.",
            price: "5000",
            thumbnail: "https://static.cinemarkhoyts.com.ar/Images/Posters/4e002da7723fb0e44a98601716b3ec51.jpg?v=00002398",
            code: "783",
            stock: 5,
            status: true
        };
        let responseBody = await requester.post("/api/products").send(mockProduct).set("Cookie", `userCookie=${cookieValue}`)
        let emailUser = { email: userCookie.email }
        let product = await productModelo.findOne({ _id: responseBody.body._id })
        let { body, status } = await requester.delete(`/api/products/${product._id}`).send(emailUser).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(204)
    })
}) */