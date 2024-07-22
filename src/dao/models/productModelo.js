import mongoose from "mongoose"

import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products"
const productSchema = new mongoose.Schema(
    {
        owner: {
            type: String,
            default: "admin"
            //type: mongoose.Types.ObjectId,
            //ref: 'users',
            //default: "admin"//si el usuario no tiene rol porque se logeo con git hub --> crearlo --> crear un producto
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
/*
productSchema.pre('findOne', function () {
    this.populate('owner')
});
productSchema.pre('findOne', function () {
    this.populate({
        path: 'owner',
        select: 'email'
    });
});
*/



productSchema.plugin(mongoosePaginate)
export const productModelo = mongoose.model(
    productCollection,
    productSchema
)

