import os from "os"

export const argumentosProducts = (product) => {

    let { title, category, description, price, thumbnail, stock, status } = product;
    let argumentoFaltantes = [];
    if (!title || title.trim() === "") argumentoFaltantes.push("Title");
    if (!category || category.trim() === "") argumentoFaltantes.push("Category");
    if (!description || description.trim() === "") argumentoFaltantes.push("Description:");
    if (!price || isNaN(parseFloat(price))) argumentoFaltantes.push("Price (se requieren datos tipo numerico)");
    if (!thumbnail || thumbnail.trim() === "") argumentoFaltantes.push("Thumbnail");
    if (!stock || isNaN(parseInt(stock))) argumentoFaltantes.push("Stock (se requieren datos tipo numerico)");
    if (!status) argumentoFaltantes.push("status");

    return argumentoFaltantes.length > 0
        ? `Dato faltante/s: ${argumentoFaltantes.join(", ")}`
        : "Todos los datos están completos.";
}
