
const socket = io()
let divListado = document.getElementById("listadoDeProductos")
socket.emit("getProducts")
socket.on("listProducts", (products) => {
    divListado.innerHTML = ""
    products.forEach(product => {
        let title = document.createElement("p")
        title.textContent = product.title.title
        //title.textContent = product.title.title
        divListado.appendChild(title)
    });
});
let addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const thumbnail = document.getElementById("thumbnail").value;
    const stock = parseInt(document.getElementById("stock").value);
    const status = document.getElementById("status").checked
    let product = {
        title,
        category,
        description,
        price,
        thumbnail,
        stock,
        status
    }
    socket.emit('addProduct', product);
    console.log(product);
});



let deletProductForm = document.getElementById("deleteProductForm")
deletProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let code = document.getElementById("codeProductDeleted").value
    socket.emit('deleteProduct', { code })
})