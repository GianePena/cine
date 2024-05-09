

let reMedio = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


let inputName = document.getElementById("name");
let inputEmail = document.getElementById("email");
let inputMessage = document.getElementById("inputMessage");
let divUser = document.getElementById("usuario");
let divMessage = document.getElementById("message");
let show = document.getElementById("ocultar");
let btn = document.getElementById("enviar");


const socket = io();

btn.addEventListener("click", (e) => {
    e.preventDefault();

    let user = inputName.value.trim();
    let email = inputEmail.value.trim();


    if (user.length > 0 && email.length > 0) {
        if (reMedio.test(email)) {

            socket.emit("usuario", { user, email });
            show.style.display = 'none';
        } else {
            alert("Por favor, introduce un correo electrónico válido.");
        }
    } else {
        alert("Por favor, completa todos los campos.");
    }
});


inputMessage.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        e.preventDefault();
        let message = inputMessage.value.trim();
        let user = inputName.value.trim();
        let email = inputEmail.value.trim();
        if (message.length > 0 && user.length > 0 && email.length > 0) {
            socket.emit("mensaje", { user, email, message });
            inputMessage.value = "";
        } else {
            alert("Por favor, completa todos los campos.");
        }
    }
});


socket.on("nuevoUsuario", (user) => {
    divUser.innerHTML += `<span>Usuario <strong> ${user}</strong> se ha conectado</span><br><br>`;
});

socket.on("nuevoMensaje", ({ user, message }) => {
    divMessage.innerHTML += `<span class="mensaje"><strong>${user}</strong> dice <i>${message}</i></span><br>`;
});
