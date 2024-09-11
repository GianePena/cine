import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';
import { v4 as uuidv4 } from 'uuid'
const productCollection = "products"
const productSchema = new mongoose.Schema(
    {
        owner: {
            type: String,
            default: "admin"
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        thumbnail: String,
        code: {
            type: String,
            default: uuidv4,
            unique: true
        },
        stock: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
)


productSchema.plugin(mongoosePaginate)
export const productModelo = mongoose.model(
    productCollection,
    productSchema
)


