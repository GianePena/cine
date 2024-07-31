import { Router } from 'express';
import { transporter } from "../utils/mail.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js";
//import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken"
import { config } from '../config/config.js';

export const sendCodeRouter = Router();
let code = "C-4F74A8"
sendCodeRouter.post('/sendCode', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return CustomError.createError("Error en el email", 'Email es necesario para recuperar la contraseña', TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
    }
    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("linkRecuperacionPassword", token, { httpOnly: true });
    req.logger.info(`Codigo: ${code}`)
    const link = `http://localhost:3000/newPassword?token=${token}`;
    const mailOptions = {
        from: "gianellapena01@gmail.com",
        to: email,
        subject: "Código de Recuperación de Contraseña",
        html: `<h2>Código de recuperación de contraseña:${code}</h2><br><hr> 
        <a href="${link}">Generar nueva contraseña</a>`
    };
    req.logger.info(mailOptions)
    transporter.sendMail(mailOptions)
        .then(resultado => res.send("Correo enviado: " + resultado.response))
        .catch(error => res.send("Error al enviar correo: " + error.message));
});