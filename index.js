
const products=[]
console.log(products)
class ProductManager{
    constructor(title, description, price, thumbnail, code, stock){ 
        this.title=title,
        this.description=description,
        this.price=price,
        this.thumbnail=thumbnail,
        this.code=code,
        this.stock=stock
    }
    addProduct(title, description, price, thumbnail, code, stock){
        const newcode=products.some(product=>product.code===code)
        if(!newcode && title && description && price && thumbnail && stock){
            const contador=0
            const newProduct={
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: contador+1
            }
            products.push(newProduct)
        } else{
            alert("El codigo es =")
        }
    }
    getProduct(){
        const productManager = new ProductManager
        productManager.addProduct("Patos", "cxcxcxc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/eae343c50d05a3beb2532361519d2ecc.jpg?v=00002290", 111, 40)
        productManager.addProduct("Con todos menos contigo", "grsdfsf", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/6590da5dcf18a04860c0ccd93727b38f.jpg?v=00002290", 143, 40)
        productManager.addProduct("Madame web", "gdfgdg", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/c272d94125a7b844a7cd79859bf9db28.jpg?v=00002290", 122, 40)
        productManager.addProduct("KunFu Panda 4", "basdasdad", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/b008cba4654343ef87745ae0d5633793.jpg?v=00002290", 125, 40)
        productManager.addProduct("Duna", "sadasda", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9259ce8559aa01f8fd771054cd3a1a28.jpg?v=00002290", 132, 40)
        productManager.addProduct("Pobres criaturas", "cxcxcc", 3000, "https://static.cinemarkhoyts.com.ar/Images/Posters/9a7859e6ed1c4fb77bf24248a679946b.jpg?v=00002290", 98, 40)
    }
    getProductById(id){
        if(products.find(product=>product.id===id)){
            console.log(products.find(product=>product.id===id))
        }
        else{
            console.error("Not found");
        }

        
    }
    
}

const productManager = new ProductManager

productManager.getProduct()
productManager.getProductById()
console.log(products);


