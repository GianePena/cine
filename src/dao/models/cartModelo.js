import mongoose from "mongoose"

const cartCollection = "cart"

const cartSchema = new mongoose.Schema(
    {
        title: String,
        quantity: Number,
        id: String
    }
)

export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)