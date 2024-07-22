import { Router } from "express"
import { CartManagerMONGO as CartManager } from "../DAO/cartManagerMONGO.js";
import { ProductManagerMONGO as ProductManager } from "../DAO/productManagerMONGO.js"
import { authorization } from "../middleware/auth.js";
import { passportCall } from "../utils/utils.js";

export const router = Router()
const cartManager = new CartManager();
const productManager = new ProductManager("./api/products.json");



router.get('/products/json', (req, res) => {
    let products = productManager.getProducts()
    console.log(products);
    res.setHeader(`Content-Type`, `text/html`)
    res.status(200).render('index', { products })
})

router.get('/realtimeproducts', passportCall("jwt"), authorization(["admin", "premium"]), (req, res) => {
    res.status(200).render('realTimeProducts')
})



router.get('/chat', passportCall("jwt"), authorization(["user"]), (req, res) => {
    res.status(200).render('chat');
});

router.get('/products', passportCall("jwt"), authorization(["admin", "user", "premium"]), async (req, res, next) => {

    let { limit, page, sort } = req.query;
    limit = limit ? Number(limit) : 10;
    page = page ? Number(page) : 1;
    try {
        const { docs: products, totalDocs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPaginate(page, limit, sort);
        return res.status(200).render('products', {
            user: req.user,
            products,
            totalDocs,
            totalPages,
            page,
            limit,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            linkPrevPage: prevPage ? `?limit=${limit}&page=${prevPage}` : null,
            linkNextPage: nextPage ? `?limit=${limit}&page=${nextPage}` : null,
        });
    }
    catch (error) {
        next(error)
    }
});


router.get('/loggerTest', (req, res) => {
    req.logger.error('Error: log test');
    req.logger.warn('Warn: log test');
    req.logger.info('Info: log test')
    req.logger.http('http: log test')
    req.logger.verbose('verbose: log test');
    req.logger.debug('Debug: log test');
    req.logger.silly('Silly: log test')
    res.send('Logging tests');
});
router.get('/logout', (req, res) => {
    res.clearCookie("userCookie");
    res.redirect("/login");
});



router.get('/carts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let cart = await cartManager.getCartById(id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        console.log(cart);
        res.setHeader(`Content-Type`, `text/html`)
        return res.status(200).render('cart', { cart });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Error fetching the cart with ID ${id}` });
    }
});

//VISTAS Login
router.get('/registro', (req, res) => {
    res.status(200).render('registro')
})
router.get('/login', (req, res) => {
    res.status(200).render('login')
})
