import { messageModelo } from "./models/messagesModelo.js"

class Mensage {
    async getMenssages() {
        return await messageModelo.find()
    }
}
export { Mensage }