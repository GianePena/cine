
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