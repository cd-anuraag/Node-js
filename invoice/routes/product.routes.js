const router = require("express").Router()
const jwtAuthMiddleware = require("../../middleware/jwt.auth.middleware")
const productController = require("../controllers/product.controller")

router.post('/add',
    jwtAuthMiddleware.verifyToken,
    productController.addProduct)

module.exports = router
