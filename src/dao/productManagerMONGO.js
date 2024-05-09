
import { productModelo } from "./models/productModelo.js";
import { v4 as uuidv4 } from 'uuid';
class ProductManagerMONGO {
    /*constructor(path) {
        this.path = path,
            this.products = [],
            this.id = 1
    }*/

    async getProducts() {
        return await productModelo.find().lean()
    }
    //PAGINATE
    async getProductsPaginate(page, limit, sort) {
        const options = {
            page: page,
            limit: limit,
            lean: true,
        };

        if (sort) {
            options.sort = {
                'price': sort,
            }
        }

        return await productModelo.paginate({}, options) //2 argumentos: filtro
    }//DEVUELVE UN OBJETO CON PROPIEDADES DOCS (ARRAY CON DOCUMENTOS), TOTAL DOC, LIMITE, ....
    async addProduct(product) {
        return (await productModelo.create(product))
    }
    async getProductsBy(filter) {
        return await productModelo.find(filter).lean()
    }
    async getProductById(id) {
        return await productModelo.findById({ id })
    }
    async updateProduct(id) {
        return await productModelo.findByIdAndUpdate(id)
    }
    async deleteProduct(id) {
        return await productModelo.deleteOne({ _id: id })
    }


}

export { ProductManagerMONGO }

/*

_id
66341e3bae100d582fa75341
title: "GARFIELD FUERA DE CASA"
category: "animacion"
description: "Garfield , el famoso gato amante de la lasaña que odia los lunes, está…"
price:5000
thumbnail:"https://static.cinemarkhoyts.com.ar/Images/Posters/2bc9ca70c2febb6faf5…"
stock: 12
status: true
code: 937
id: "0adc183b-c485-4b06-b0e9-c4ebffd0841e"
createdAt
2024-05-02T23:14:03.895+00:00
updatedAt
2024-05-02T23:14:03.895+00:00
__v
0





_id
66341e60ae100d582fa75344
title
"HORRORLAND"
category
"terror"
description
"Una exclusiva noche privada de Halloween en Liseberg se convierte rápi…"
price
4500
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/feaa7b4e69f36adba02…"
stock
40
status
true
code
289
id
"4755fd99-3227-4573-a702-5107525b9ebb"
createdAt
2024-05-02T23:14:40.576+00:00
updatedAt
2024-05-02T23:14:40.576+00:00
__v
0
_id
66341e8aae100d582fa75347
title
"EL PLANETA DE LOS SIMIOS"
category
"accion"
description
"El director Wes Ball le da nueva vida a la épica franquicia global sit…"
price
5500
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/ef14c460149945bb666…"
stock
40
status
true
code
31
id
"2eaa56f5-cf8c-40b3-ae6f-63732b436c3c"
createdAt
2024-05-02T23:15:22.738+00:00
updatedAt
2024-05-02T23:15:22.738+00:00
__v
0
_id
66341ea6ae100d582fa7534a
title
"STAR WARS EPISODIO 1 LA AMENAZA FANTASMA"
category
"accion"
description
"La Federación de Comercio ha bloqueado el pequeño planeta de Naboo, go…"
price
5000
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/38dc0ef8dd0d690d513…"
stock
10
status
true
code
513
id
"f2dd5b6e-fd07-456e-abc8-a93f26553508"
createdAt
2024-05-02T23:15:50.860+00:00
updatedAt
2024-05-02T23:15:50.860+00:00
__v
0
_id
66341ebcae100d582fa7534d
title
"PROFESION PELIGRO"
category
"accion"
description
"Es un doble de acción y, como todo el mundo en el mundo de los dobles …"
price
5000
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/a804db06f8d0cb94231…"
stock
12
status
true
code
96
id
"89b5443e-3714-4290-a989-8ceb88ba15e5"
createdAt
2024-05-02T23:16:12.224+00:00
updatedAt
2024-05-02T23:16:12.224+00:00
__v
0
_id
66341ed8ae100d582fa75350
title
"PATOS"
category
"animacion"
description
"La familia Mallard está pasando por una pequeña crisis. Mientras que e…"
price
4500
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/eae343c50d05a3beb25…"
stock
34
status
true
code
175
id
"9e87c434-5c29-417c-a41e-f91ec05b8311"
createdAt
2024-05-02T23:16:40.306+00:00
updatedAt
2024-05-02T23:16:40.306+00:00
__v
0
_id
66341ef0ae100d582fa75353
title
"BACK TO BLACK"
category
"biografia"
description
"La extraordinaria historia de Amy Winehouse hacia la fama y la creació…"
price
5000
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/a2bfd9d5ffc04a94387…"
stock
40
status
true
code
242
id
"d6c06eb4-17e0-4981-bd55-9c174de5a230"
createdAt
2024-05-02T23:17:04.663+00:00
updatedAt
2024-05-02T23:17:04.663+00:00
__v
0
_id
66341f65ae100d582fa75356
title
"DUNA PARTE DOS"
category
"accion"
description
" Explorará el viaje mítico de Paul Atreides mientras se une a Chani y …"
price
5000
thumbnail
"https://static.wikia.nocookie.net/doblaje/images/2/25/Duna_Poster_Ofic…"
stock
10
status
true
code
686
id
"65f2ed06-dcac-4a16-8d26-34836bc2f0b5"
createdAt
2024-05-02T23:19:01.486+00:00
updatedAt
2024-05-02T23:19:01.486+00:00
__v
0
_id
6634204eae100d582fa75359
title
"GODZILLA X KONG EL NUEVO IMPERIO"
category
"accion"
description
"¡La batalla épica continúa! La película de Legendary Pictures continúa…"
price
5500
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/f7ab65168d58cdfc107…"
stock
40
status
true
code
960
id
"27e08805-7733-4d3b-bd0e-1640035a2e86"
createdAt
2024-05-02T23:22:54.592+00:00
updatedAt
2024-05-02T23:22:54.592+00:00
__v
0
_id
66342084ae100d582fa7535c
title
"DESAFIANTES"
category
"accion"
description
"Una ex prodigio del tenis se convierte en entrenadora y una fuerza de …"
price
5000
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/5a5f4264461e11d4e44…"
stock
25
status
true
code
205
id
"10e4d1cc-049e-49dc-b607-61ad5556ed7a"
createdAt
2024-05-02T23:23:48.344+00:00
updatedAt
2024-05-02T23:23:48.344+00:00
__v
0
_id
663420a0ae100d582fa7535f
title
"LA GARRA DE HIERRO"
category
"drama"
description
"Basada en la vida de los inseparables hermanos Von Erich, que hicieron…"
price
5000
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/ComingSoon/200x285/1190.jpg…"
stock
8
status
true
code
362
id
"87343e19-3194-40b9-ac2b-b790af049222"
createdAt
2024-05-02T23:24:16.067+00:00
updatedAt
2024-05-02T23:24:16.067+00:00
__v
0
_id
663420d6ae100d582fa75362
title
"CON TODOS MENOS CONTIGO"
category
"comedia"
description
"Bea y Ben, antiguos compañeros de universidad cuya mutua atracción ini…"
price
4500
thumbnail
"https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c…"
stock
30
status
true
code
346
id
"bd144784-16d0-4592-88d6-2772589d24e0"
createdAt
2024-05-02T23:25:10.403+00:00
updatedAt
2024-05-02T23:25:10.403+00:00
__v
0*/