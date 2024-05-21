import mongoose, { Schema } from "mongoose";

const userCollection = "users"
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String

        },
        password: {
            type: String
        },
        rol: {
            type: String,
            default: "usuario"
        }

    },
    {
        timestamps: true,
        strict: false
    }
)
export const userModelo = mongoose.model(
    userCollection,
    userSchema
) 