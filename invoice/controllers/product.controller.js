const _ = require("lodash")
const responseLib = require("../../lib/handler/handler.response.lib")
const mongoLib = require("../../lib/database/database.mongo.lib")
const pdfLib = require("../../lib/pdf/pdf.lib")
const imageLib = require("../../lib/image/image.lib")

const quotationModel = require("../models/quotation.model")

const resStatusEnum = require("../../enum/res.status.enum")
const GST = 0.18

async function addProduct(req, res) {
    try {
        let userId = req.userId
        let {products} = req.body
        if (_.isEmpty(products)) {
            return responseLib.sendResponse(
                res,
                null,
                "Products are required",
                resStatusEnum.VALIDATION_ERROR,
            )
        }

        for (let product of products) {
            if (_.isNil(product.name) || _.isNil(product.qty) || _.isNil(product.rate)) {
                return responseLib.sendResponse(
                    res,
                    null,
                    `Name ${product.name}, qty ${product.qty}, rate ${product.rate} are required`,
                    resStatusEnum.VALIDATION_ERROR,
                )
            }
        }
        products = products.map(product => {
            return {
                name: product.name,
                qty: product.qty,
                rate: product.rate,
                gst: GST,
                total: product.qty * product.rate,
            }
        })

        let pdfUrl = await pdfLib.generatePdf(userId, products, new Date())
        let imageUrl = await imageLib.generateImage(userId, products, new Date())
        pdfUrl = req.protocol + "://" + req.get("host") + pdfUrl
        imageUrl = req.protocol + "://" + req.get("host") + imageUrl


        await mongoLib.createDoc(quotationModel, {
            userId: userId,
            products: products,
            date: new Date(),
            pdfUrl: pdfUrl,
            imageUrl: imageUrl
        })

        return responseLib.sendResponse(
            res,
            {
                message: "Invoice generated successfully",
                pdfUrl: pdfUrl,
                imageUrl: imageUrl,
            },
            null,
            resStatusEnum.SUCCESS,
        )


    } catch (error) {
        return responseLib.sendResponse(
            res,
            null,
            error,
            resStatusEnum.INTERNAL_SERVER_ERROR,
        )
    }
}

module.exports = {
    addProduct: addProduct,
}
