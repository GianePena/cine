import mongoose from "mongoose"

const cartCollection = "cart"

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    title: String
                },
                quantity: Number,
                date: Date
            }
        ]
    }
)

export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)