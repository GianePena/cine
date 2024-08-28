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
            required: true
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
            type: String, enum: ['admin', 'premium', 'user'],
            default: 'user'
        },
        documents: [
            {
                name: {
                    type: String,
                    default: null
                },
                reference: {
                    type: String,
                    default: null
                },
                type: {
                    type: String, enum: ['DNI', 'DOMICILIO', 'ESTADO_CUENTA'],
                    default: null
                }
            }
        ]
        ,
        last_conection: {
            type: String,
            default: null
        },
        status: {
            type: String, enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true,
        strict: false
    }
)

userSchema.pre(['find', 'findMany'], function () {
    this.populate('cart')
});
export const userModelo = mongoose.model(
    userCollection,
    userSchema
)
