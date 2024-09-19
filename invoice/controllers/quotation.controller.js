const _ = require("lodash")
const fs = require("fs")
const path = require("path")
const mongoLib = require("../../lib/database/database.mongo.lib")
const responseLib = require("../../lib/handler/handler.response.lib")
const quotationModel = require("../models/quotation.model")
const resStatusEnum = require("../../enum/res.status.enum")

async function getQuotations(req, res) {
    try {
        let userId = req.userId

        const quotations = await mongoLib.findByQuery(quotationModel, {userId: userId})

        return responseLib.sendResponse(res, {
            message: "Quotations fetched successfully", quotations: quotations,
        }, null, resStatusEnum.SUCCESS)

    } catch (error) {
        return responseLib.sendResponse(res, null, error, resStatusEnum.INTERNAL_SERVER_ERROR,)
    }
}

async function downloadQuotation(req, res) {
    try {
        const {filename} = req.params

        const baseDir = path.join(__dirname, '..', '..'); // Adjust the number of '..' as needed to navigate to the desired base directory
        const filePath = path.join(baseDir, 'lib', 'pdf', 'invoices', filename);
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return responseLib.sendResponse(res, null, {error: 'File not found'}, resStatusEnum.NOT_FOUND,)
        }

        // Serve the PDF file
        res.sendFile(filePath);

    } catch (error) {
        return responseLib.sendResponse(res, null, error, resStatusEnum.INTERNAL_SERVER_ERROR,)
    }
}

async function downloadImageQuotation(req, res) {
    try {
        const {filename} = req.params

        const baseDir = path.join(__dirname, '..', '..'); // Adjust the number of '..' as needed to navigate to the desired base directory
        const filePath = path.join(baseDir, 'lib', 'image', 'invoices', filename);
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return responseLib.sendResponse(res, null, {error: 'File not found'}, resStatusEnum.NOT_FOUND,)
        }

        // Serve the image file
        res.sendFile(filePath);

    } catch (error) {
        return responseLib.sendResponse(res, null, error, resStatusEnum.INTERNAL_SERVER_ERROR,)
    }
}

module.exports = {
    getQuotations: getQuotations, downloadQuotation: downloadQuotation,
    downloadImageQuotation: downloadImageQuotation
}
