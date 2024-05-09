import mongoose from "mongoose"
import { productModelo } from "./productModelo.js";
import { v4 as uuidv4 } from 'uuid';
const cartCollection = "cart"


const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }
            ]
        },
        username: String,
        country: String,
    }, {
    timestamps: true,
}
)
cartSchema.pre('find', function () {
    this.populate('products.product').lean();
});


export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)