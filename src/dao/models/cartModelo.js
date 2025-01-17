import mongoose from "mongoose"
const cartCollection = "cart"


const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: 'products',
                        required: true
                    },
                    quantity: {
                        type: Number,
                        default: 1
                    }
                }
            ]
        }
    }, {
    timestamps: true
}
)

cartSchema.pre('findOne', function () {
    this.populate('products.product')
});
cartSchema.pre('find', function () {
    this.populate('products.product')
});

export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)