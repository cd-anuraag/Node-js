const mongoose = require('mongoose');
const collectionEnum = require('../../enum/collection.enum');
const productSchema = new mongoose.Schema({
    name: String,
    qty: Number,
    rate: Number,
    gst: Number,
    total: Number
});

const quotationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    products: [productSchema],
    date: {type: Date},
    pdfUrl: {type: String},
    imageUrl: {type: String}
});

module.exports = mongoose.model(collectionEnum.QUOTATION, quotationSchema);
