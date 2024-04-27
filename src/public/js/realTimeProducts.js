const addProductForm = document.getElementById("addProductForm");
const divListado = document.getElementById("listadoDeProductos");
let deletProductForm = document.getElementById("deleteProductForm")
const socket = io();


socket.on("listProducts", (products) => {
    divListado.innerHTML = "";
    products.forEach((product) => {
        const productElement = document.createElement("p");
        productElement.textContent = `${product.title}`;
        divListado.appendChild(productElement);
    });
});


addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();


    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const thumbnail = document.getElementById("thumbnail").value;
    const stock = parseInt(document.getElementById("stock").value);
    const status = document.getElementById("status").checked;
    socket.emit("addProduct", {
        title,
        category,
        description,
        price,
        thumbnail,
        stock,
        status
    });
    addProductForm.reset();
});
deletProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let id = document.getElementById("codeProductDeleted").value
    socket.emit('deleteProduct', { id })
    deletProductForm.reset()
})