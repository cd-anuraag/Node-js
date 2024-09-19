const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const GST = 0.18;

async function generatePdf(userId, products) {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-accelerated-2d-canvas", "--no-first-run", "--no-zygote", "--disable-gpu",],
        })
        const page = await browser.newPage();

        const total = products.reduce((sum, product) => sum + product.total, 0);
        const gstAmount = total * GST;
        const grandTotal = total + gstAmount;
        const validityDate = new Date(); // Adjust the validity date as needed
        validityDate.setDate(validityDate.getDate() + 30); // Example: 30 days from today
        const termsAndConditions = "Sample terms and conditions text"; // Random text or replace with dynamic content


        const productsHtml = products.map(product => `<tr>
    <td style="padding: 2px 4px;">${product.name}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.qty}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.rate}</td>
    <td style="padding: 2px 4px; text-align: right;">${product.total}</td>
  </tr>`).join('');


        const htmlContent = `
<html>
  <body>
    <h1>Invoice</h1>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
      <tr>
        <th style="padding: 2px 4px; text-align: left; width: 40%;">Product</th>
        <th style="padding: 2px 4px; text-align: right; width: 15%;">Quantity</th>
        <th style="padding: 2px 4px; text-align: right; width: 20%;">Rate</th>
        <th style="padding: 2px 4px; text-align: right; width: 25%;">Total</th>
      </tr>
      ${productsHtml}
      <!-- Add a row for the total section -->
      <tr>
        <td colspan="3" style="text-align: right; padding: 2px 4px; font-size: 0.9em;">
          <strong>Total:</strong>
        </td>
        <td style="padding: 2px 4px; text-align: right; font-size: 0.9em;">INR ${total.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: right; padding: 2px 4px; font-size: 0.9em;">
          <strong>GST (18%):</strong>
        </td>
        <td style="padding: 2px 4px; text-align: right; font-size: 0.9em;">INR ${gstAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: right; padding: 2px 4px; font-size: 0.9em;">
          <strong>Grand Total:</strong>
        </td>
        <td style="padding: 2px 4px; text-align: right; font-size: 0.9em;">INR ${grandTotal.toFixed(2)}</td>
      </tr>
    </table>
    <p><strong>Valid Until: ${validityDate.toDateString()}</strong></p>
    <p><em>${termsAndConditions}</em></p>
  </body>
</html>
`;

        await page.setContent(htmlContent);
        console.log("path", path.join(__dirname))
        console.log("dirname", __dirname)
        console.log("cwd", process.cwd())
        console.log("files", fs.readdirSync(path.join(__dirname)))
        console.log(path.join(__dirname, '..', '..'))
        const pdfPath = path.join(__dirname, 'invoices', `${userId}_${Date.now()}.pdf`);
        // Save the PDF
        await page.pdf({path: pdfPath, format: 'A4'});

        await browser.close();

        // Return the URL to access the PDF
        return `/quotation/download/${path.basename(pdfPath)}`;

    } catch (error) {
        throw error
    }
}


module.exports = {
    generatePdf: generatePdf,
}
