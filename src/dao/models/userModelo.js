import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        age: {
            type: Number
        },
        password: {
            type: String
        },
        cart: {
            type: mongoose.Types.ObjectId,
            ref: 'cart'
        },
        rol: {
            type: String,
            default: "user"
        }
    },
    {
        timestamps: true,
        strict: false
    }
)
userSchema.pre('find', function () {
    this.populate('cart.cart').lean();
});

export const userModelo = mongoose.model(
    userCollection,
    userSchema
)
