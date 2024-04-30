import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';

const productCollection = "products" //nombre al modelo y a la coleccion
//esquema--> es la forma en que yo le indico a mongoose las prop que tiene que tener la coleccion
const productSchema = new mongoose.Schema(
    { //propiedades
        title: String,
        category: String,
        description: String,
        price: Number,
        thumbnail: String,
        code: Number,
        stock: Number,
        status: Boolean,
        id: String
    },
    {
        timestamps: true //genera cuadno yo cree el documento genera la prop createdAdd y cuadno la modifique quegera el updatedAdd
        //colecction: "products" --> por l¡si la coleccion difiere al nodbre del modelo ej: usuarios2022
    }//configurar dif tipos de coasas asociadas al modelo de la coleccion
)

export const productModelo = mongoose.model(
    productCollection, //nombre de la coleccion
    productSchema //el esquema
)
