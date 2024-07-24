
import nodemailer from "nodemailer"

const letrasNumeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]

export function generateCode() {
    let code = "C-"
    for (let i = 0; i < 6; i++) {
        code += letrasNumeros[getRandomletrasNumeros()]
    }
    return code
}
let getRandomletrasNumeros = () => {
    return Math.floor(Math.random() * letrasNumeros.length)
}
export const code = generateCode()
export const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        port: "587",
        auth: {
            user: "gianellapena01@gmail.com",
            pass: "pmoyjqybqcylidlc"
        }
    }
)