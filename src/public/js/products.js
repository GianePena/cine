
let addToCartButtons = document.getElementById("addToCartButton")


const handleAddToCartClick = async (productsId) => {
    let username = document.getElementById("username").value
    let country = document.getElementById("country").value
    const cartId = localStorage.getItem('cartId')
    if (!cartId) {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: [{
                    "product": productsId,
                    "quantity": 1
                }],
                username: username,
                country: country
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Producto agregado al carrito con éxito");
            localStorage.setItem('cartId', data.newCart._id);
        } else {
            alert("Error al agregar al carrito: " + data.error);
        }
    }
    else {
        const response = await fetch(`/api/cart/${cartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: [{
                    "product": productsId,
                    "quantity": 1
                }],
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Producto agregado al carrito con éxito");
        } else {
            alert("Error al agregar al carrito: " + data.error);
        }
    }
}





addToCartButtons.forEach(button => {
    button.addEventListener("click", handleAddToCartClick);
});

