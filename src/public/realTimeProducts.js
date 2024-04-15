
const socket = io()
let divListado = document.getElementById("listadoDeProductos")
socket.emit("getProducts")

socket.on("productos", (products) => {
    divListado.innerHTML = ""

    products.forEach(product => {
        let titulo = document.createElement("p")
        titulo.textContent = product.title
        divListado.appendChild(titulo)
    });
});


let addProductForm = document.getElementById("addProductForm")
addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value
    const category = document.getElementById("category").value
    const description = document.getElementById("description").value
    const thumbnail = document.getElementById("thumbnail").value
    const price = document.getElementById("price").value
    const stock = document.getElementById("stock").value
    const status = document.getElementById("status").value
    socket.emit('addProduct', { title, category, description, thumbnail, price, status, stock })
})

let deletProductForm = document.getElementById("deleteProductForm")
deletProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let id = document.getElementById("idEliminado").value
    socket.emit('deleteProduct', { id })
})
