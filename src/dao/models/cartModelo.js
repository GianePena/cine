import mongoose from "mongoose"
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
    //STRICT:FALSE --> PERMITE AGREGAR CAMPOS DEIFERENCTES AL MODELO AL CREACION DE UN INSTACION. EJ: FOTO --> SI LA TIENE LA GUARDA Y SI  NO NO

}
)
cartSchema.pre('find', function () {
    this.populate('products.product').lean();
});


export const cartModelo = mongoose.model(
    cartCollection,
    cartSchema
)