const router = require("express").Router()
const jwtAuthMiddleware = require("../../middleware/jwt.auth.middleware")
const quotationController = require("../controllers/quotation.controller")

router.get("/list",
    jwtAuthMiddleware.verifyToken,
    quotationController.getQuotations)

router.get("/download/:filename",
    quotationController.downloadQuotation)

router.get("/download/image/:filename",
    quotationController.downloadImageQuotation)
module.exports = router
