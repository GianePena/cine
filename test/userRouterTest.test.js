import mongoose, { isValidObjectId } from "mongoose"
import { afterEach, before, describe, it } from "mocha"
import { assert, expect } from "chai"
import supertest from "supertest"
import { userModelo } from "../src/DAO/models/userModelo.js"
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
describe("Pruebas router USER: get, getById, post, update y delete", async function () {
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
            documents: [
                {
                    name: "Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p.Â m..png",
                    reference: "src/utils/documents/Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p…",
                    type: "DNI"
                },
                {
                    name: "Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p.Â m..png",
                    reference: "src/utils/documents/Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p…",
                    type: "DOMICILIO"
                },
                {
                    name: "Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p.Â m..png",
                    reference: "src/utils/documents/Captura de pantalla 2024-08-18 a la(s) 8.59.35â¯p…",
                    type: "ESTADO_CUENTA"
                }
            ]
        };
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
        await mongoose.connection.collection("users").deleteMany({ email: "testest@gmail.com" })
    })
    it("Pruebas GET users: la ruta api/user/ ", async function () {
        let { body, status } = await requester.get("/api/user");
        expect(status).to.equal(200)
        expect(Array.isArray(body)).to.be.true
        if (Array.isArray(body) && body.length > 0) {
            expect(body[0]).to.have.property('first_name')
            expect(body[0]).to.have.property('last_name')
            expect(body[0]).to.have.property('email')
            expect(body[0]).not.to.have.property('password')
            expect(isValidObjectId(body[0]._id)).to.be.true
        }
    });
    it("Pruebas GET user BY ID : la ruta api/user/:pid  TRAE AL USER DEL ID INDICADO", async function () {
        let { body, status } = await requester.get(`/api/user/${userCookie._id}`).set("Cookie", `userCookie=${cookieValue}`)
        expect(status).to.equal(200)
        expect(body).to.have.property('first_name')
        expect(body).to.have.property('last_name')
        expect(body).to.have.property('email')
        expect(body).not.to.have.property('password')
        expect(body).to.have.property('_id')
        expect(isValidObjectId(body._id)).to.be.true
    });
    it("Prueba LOGIN user: ruta api/user/ REALIZA EL LOGIN DEL USER", async function () {
        const mockUser = {
            first_name: "test",
            last_name: "test",
            email: "testest@gmail.com",
            age: 23,
            password: "123456"
        }
        await requester.post("/api/user/registro").send(mockUser)
        const mockUserLogin = { email: "testest@gmail.com", password: "123456" }
        let { body, status } = await requester.post(`/api/user/login`).send(mockUserLogin)
        expect(status).to.equal(200)
        expect(body).to.exist.to.equal(`Usuario ${mockUserLogin.email} logeado con exito`)
    })
    it("Prueba POST user: ruta api/user/registro CREA UN NUEVO USER", async function () {
        const mockUser = {
            first_name: "test",
            last_name: "test",
            email: "testest@gmail.com",
            age: 23,
            password: "123456"
        };
        let { body, status } = await requester.post("/api/user/registro").send(mockUser)
        expect(status).to.equal(200)
        expect(body).to.have.property('first_name')
        expect(body).to.have.property('last_name')
        expect(body).to.have.property('email')
        expect(body).to.have.property('age')
        expect(body).to.have.property('rol')
        expect(body).not.to.have.property('password')
        expect(body).to.have.property('_id')
        expect(isValidObjectId(body._id)).to.be.true
    });
    it("Pruba PUT user: ruta api/user/premium/:uid  MODIFICA EL ROL DEL USUER USER/PREMIUM", async function () {
        let { body, status } = await requester.put(`/api/user/premium/${userCookie._id}`)
        console.log(body);
        expect(status).to.equal(200)
        expect(body).to.have.property('first_name')
        expect(body).to.have.property('last_name')
        expect(body).to.have.property('email')
        expect(body).not.to.have.property('password')
        expect(body).to.have.property('rol').that.equals('premium')
        expect(body).to.have.property('_id')
        expect(isValidObjectId(body._id)).to.be.true
    })
    it("Prueba UPDATE PASSWORD user: ruta api/user/updatePassword MODIFICA LA PASSWORD DEL USER", async function () {
        let updateMockUser = { code: "C-4F74A8", email: userCookie.email, password: "123" }
        let { body, status } = await requester.post(`/api/user/updatePassword`).send(updateMockUser)
        expect(status).to.equal(201)
        expect(body).to.exist.to.equal(`Contraseña del usuario: ${userCookie.email} actualizada`)
    })

    it("Prueba DELETE user: api/user/:uid ELIMINA EL USER", async function () {
        let { body, status } = await requester.delete(`/api/user/delete/${userCookie._id}`)
        expect(status).to.equal(200)
        expect(body).to.exist.to.equal(`Usuario ${userCookie._id} eliminado con exito`)
    })
})