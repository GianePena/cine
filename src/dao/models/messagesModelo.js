import mongoose from "mongoose"
const messageCollection = "message"

const messageSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        message: String,
    }
)
export const messageModelo = mongoose.model(
    messageCollection,
    messageSchema
)