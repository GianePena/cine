
import { fakerES_MX as faker } from "@faker-js/faker"
import { productModelo } from "../models/productModelo.js"

export const generateProducts = () => {
    let products = []
    for (let i = 0; i < 100; i++) {
        const product = new productModelo({
            title: faker.commerce.productName(),
            category: faker.commerce.productMaterial(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({ min: 100, max: 200, dec: 0 }),
            thumbnail: faker.image.urlLoremFlickr(),
            code: faker.string.alphanumeric(10),
            stock: faker.number.int({ min: 1, max: 40, dec: 0 }),
            status: faker.helpers.arrayElement(['true', 'false']),
        })
        products.push(product)
    }
    return products
}
export const productsGenerados = generateProducts()

import { userModelo } from "../models/userModelo.js"
export const generateUser = () => {
    const firstName = faker.person.firstName();
    let user = new userModelo({
        first_name: firstName,
        last_name: faker.person.lastName(),
        email: faker.internet.email({ firstName }),
        age: faker.number.int({ min: 10, max: 100, dec: 0 }),
        password: faker.internet.password({ length: 5 })
    })
    return user
}
export const usersGenerados = generateUser()