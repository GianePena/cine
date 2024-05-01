import mongoose from "mongoose"

const cartCollection = "cart"

const cartSchema = new mongoose.Schema(
    {
        title: String,
        id: String,
        quantity: Number,
    }
)

export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)