import mongoose from "mongoose"

import mongoosePaginate from 'mongoose-paginate-v2';

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
            type: Number,
            default: () => Math.floor(Math.random() * 1000) + 1,
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

