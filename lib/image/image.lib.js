const puppeteer = require('puppeteer');
const path = require('path');
const fs = require("fs");
const GST = 0.18;

async function generateImage(userId, products) {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-accelerated-2d-canvas", "--no-first-run", "--no-zygote", "--disable-gpu",],
        })
        const page = await browser.newPage();

        const total = products.reduce((sum, product) => sum + product.total, 0);
        const gstAmount = total * GST;
        const grandTotal = total + gstAmount;
        const validityDate = new Date();
        validityDate.setDate(validityDate.getDate() + 30);
        const termsAndConditions = `we are happy to supply any info you may need and trust to fulfill your order`

        const productsHtml = products.map(product => `<tr>
    <td style="padding: 2px 4px;">${product.name}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.qty}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.rate}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.total}</td>
  </tr>`).join('');

        const htmlContent = `
            <html>
            <head>
            <style>
            body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    .container {
            width: 100%;
            max-width: 800px;
            padding: 20px;
            box-sizing: border-box;
        }
    .header {
            text-align: center;
            margin-bottom: 20px;
        }
    .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
    .invoice-details {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
        }
        th, td {
            padding: 12px 8px;
            border: 1px solid #dddddd;
            text-align: right;
        }
        th {
            background-color: #f8f8f8;
            font-weight: bold;
            text-align: left;
        }
        th, td:nth-child(1) {
            text-align: left;
        }
    .totals {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
    .totals table {
            width: 50%;
            border: none;
        }
    .totals tr td {
            padding: 8px 0;
            font-weight: bold;
        }
    .footer {
            text-align: left;
            font-size: 12px;
            color: #666666;
            margin-top: 30px;
        }
    .footer .valid-until {
            margin-bottom: 8px;
            font-size: 14px;
        }
    .footer .terms {
            background-color: #333333;
            color: #ffffff;
            padding: 10px;
            border-radius: 20px;
            text-align: center;
        }
    .footer .terms p {
            margin: 0;
            line-height: 1.6;
        }
    </style>
    </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>Quotation</h1>
            </div>
            <div class="invoice-details">
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                    <!-- Use template literals in your JavaScript to dynamically insert these rows -->
                    ${productsHtml}
                </table>
            </div>
            <div class="totals">
                <table>
                    <tr>
                        <td>Total</td>
                        <td>INR ${total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>GST (18%)</td>
                        <td>INR ${gstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Grand Total</td>
                        <td>INR ${grandTotal.toFixed(2)}</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p class="valid-until"><strong>Valid Until: ${validityDate.toDateString()}</strong></p>
                <div class="terms">
                    <p>Terms and Conditions</p>
                    <p>${termsAndConditions}</p>
                </div>
            </div>
        </div>
        </body>
    </html>
`;

        await page.setContent(htmlContent);
        if (!fs.existsSync(path.join(__dirname, 'invoices'))) {
            fs.mkdirSync(path.join(__dirname, 'invoices'))
        }
        const imagePath = path.join(__dirname, 'invoices', `${userId}_${Date.now()}.png`);

        // Save the screenshot as an image
        await page.screenshot({path: imagePath, fullPage: true});

        await browser.close();

        // Return the URL to access the image
        return `/quotation/download/image/${path.basename(imagePath)}`;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateImage: generateImage,
}
