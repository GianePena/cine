import multer from "multer"
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/utils/documents')
    },
    filename: function (req, file, cb) {
        let tipo = file.mimetype.split("/")[0]
        if (tipo !== "image") {
            return cb(new Error("Solo se admiten imagenes...!"))
        }
        cb(null, file.originalname)
    }
})

export const uploads = multer({ storage: storage })
