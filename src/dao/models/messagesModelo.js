import mongoose from "mongoose"
const messageCollection = "message"

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            unique: true
        },
        message: String,
    }
)
export const messageModelo = mongoose.model(
    messageCollection,
    messageSchema
)