document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Jonkoso', price: 4000 },
        { id: 2, name: 'Cashmir', price: 15000 },
        { id: 3, name: 'Virgin Wool', price: 3500 },
        { id: 4, name: 'Satin', price: 3000 },
        { id: 5, name: 'Lace', price: 7500 },
    ];

    let cart = [];

    const cartItemsDiv = document.getElementById('cartItems');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const taxesAmountSpan = document.getElementById('taxesAmount');
    const discountAmountSpan = document.getElementById('discountAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const totalGoodsSpan = document.getElementById('totalGoods');
    const submitCartBtn = document.getElementById('submitCartBtn');
    const submitInvoiceBtn = document.getElementById('submitInvoiceBtn');
    const invoiceForm = document.getElementById('invoiceForm');
    const invoicePaperContainer = document.getElementById('invoicePaperContainer');
    const taxRate = 0.05; // 5% tax

    function renderProducts() {
        cartItemsDiv.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');
            productDiv.innerHTML = `
                <span>${product.name} - ₦${product.price.toLocaleString()}</span>
                <input type="number" min="0" value="0" data-product-id="${product.id}" class="product-quantity">
            `;
            cartItemsDiv.appendChild(productDiv);
        });

        document.querySelectorAll('.product-quantity').forEach(input => {
            input.addEventListener('change', updateCart);
        });
    }

    function updateCart() {
        cart = [];
        document.querySelectorAll('.product-quantity').forEach(input => {
            const productId = parseInt(input.dataset.productId);
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const product = products.find(p => p.id === productId);
                cart.push({ ...product, quantity });
            }
        });
        updateSummary();
    }

    function updateSummary() {
        let subtotal = 0;
        let totalGoods = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalGoods += item.quantity;
        });

        const taxes = subtotal;
        const discount = 0; // For now, no discount
        const totalAmount = subtotal - discount;

        subtotalAmountSpan.textContent = `₦${subtotal.toLocaleString()}`;
        discountAmountSpan.textContent = `₦${discount.toLocaleString()}`;
        totalAmountSpan.textContent = `₦${totalAmount.toLocaleString()}`;
        totalGoodsSpan.textContent = totalGoods;
    }

    function generateTicketId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function generateInvoice() {
        if (!invoiceForm.checkValidity()) {
            invoiceForm.reportValidity();
            return;
        }

        if (cart.length === 0) {
            alert('Please add items to your cart before generating the invoice.');
            return;
        }

        const invoiceHeader = document.getElementById('invoiceHeader').value;
        const issueDate = document.getElementById('issueDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const sellerInfo = document.getElementById('sellerInfo').value;
        const buyerName = document.getElementById('buyerName').value;
        const buyerAddress = document.getElementById('buyerAddress').value;
        const buyerContact = document.getElementById('buyerContact').value;
        const ticketId = generateTicketId();

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const taxes = subtotal;
        const discount = 0;
        const totalAmount = subtotal - discount;
        const totalGoods = parseInt(totalGoodsSpan.textContent);

        const invoiceContent = `
            <div class="invoice-paper" style="width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 10pt; border: 1px solid #ccc; margin: auto; background-color: white;">
                <style>
                    .invoice-paper table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    .invoice-paper th, .invoice-paper td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .invoice-paper th { background-color: #f2f2f2; }
                    .invoice-paper .text-right { text-align: right; }
                    .invoice-paper h2, .invoice-paper h3 { text-align: center; color: #333; }
                    .invoice-paper .section-header { margin-top: 15px; margin-bottom: 5px; font-weight: bold; }
                    .invoice-paper .footer-text { font-size: 8pt; text-align: center; margin-top: 20px; color: #555; }
                    .invoice-paper .ticket-id { font-weight: bold; margin-top: 10px; }
                </style>
                <h2 style="text-align: center; color: #333;">${invoiceHeader}</h2>
                <p style="text-align: center; margin-bottom: 20px; font-size: 11pt;"><strong>Ticket ID: ${ticketId}</strong></p>

                <table>
                    <tr>
                        <td style="width: 50%;">
                            <p><strong>Seller Info:</strong></p>
                            <pre>${sellerInfo}</pre>
                        </td>
                        <td style="width: 50%;">
                            <p><strong>Invoice Details:</strong></p>
                            <p><strong>Issue Date:</strong> ${issueDate}</p>
                            <p><strong>Due Date:</strong> ${dueDate}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <p><strong>Buyer Info:</strong></p>
                            <p><strong>Name/Business:</strong> ${buyerName}</p>
                            <p><strong>Address:</strong> ${buyerAddress}</p>
                            <p><strong>Contact:</strong> ${buyerContact}</p>
                        </td>
                    </tr>
                </table>

                <h3 class="section-header">Goods Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td class="text-right">₦${item.price.toLocaleString()}</td>
                                <td class="text-right">₦${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <table style="width: 100%; margin-top: 20px;">
                    <tr>
                        <td><strong>Subtotal:</strong></td>
                        <td class="text-right">₦${subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Taxes (5%):</strong></td>
                        <td class="text-right">₦${taxes.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Discount:</strong></td>
                        <td class="text-right">₦${discount.toLocaleString()}</td>
                    </tr>
                    <tr style="font-size: 12pt; font-weight: bold;">
                        <td><strong>TOTAL AMOUNT:</strong></td>
                        <td class="text-right">₦${totalAmount.toLocaleString()}</td>
                    </tr>
                    <tr style="font-size: 12pt; font-weight: bold;">
                        <td><strong>TOTAL GOODS:</strong></td>
                        <td class="text-right">${totalGoods}</td>
                    </tr>
                </table>

                <h3 class="section-header" style="margin-top: 30px;">Bank Account Details</h3>
                <table>
                    <tr>
                        <td><strong>BANK:</strong> Acceso Bank</td>
                        <td><strong>ACCOUNT NAME:</strong> Geladan Resources</td>
                    </tr>
                    <tr>
                        <td><strong>ACCOUNT NUMBER:</strong> 0123456789</td>
                        <td><strong>CURRENCY:</strong> ₦ NAIRA</td>
                    </tr>
                </table>

                <div class="footer-text">
                    <p>Office Address: No.20 A line Ariaria, Aba, Abia State | Phone: 09068420849</p>
                    <p>Payment Terms: Net 30 days | Refund policies as per agreement.</p>
                    <p>Thank you for your business!</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn print-btn" onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Print Invoice</button>
                <button class="btn download-btn" id="downloadInvoiceBtn" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Download PDF</button>
            </div>
        `;
        invoicePaperContainer.innerHTML = invoiceContent;
        invoicePaperContainer.style.display = 'block';

        document.getElementById('downloadInvoiceBtn').addEventListener('click', () => downloadInvoice(invoicePaperContainer.querySelector('.invoice-paper').outerHTML));
    }

    async function downloadInvoice(htmlContent) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size

        // Use html2canvas to render HTML to canvas, then add to PDF
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        element.style.width = '210mm'; // A4 width
        element.style.height = '297mm'; // A4 height
        element.style.position = 'absolute';
        element.style.left = '-9999px'; // Move off-screen
        document.body.appendChild(element);

        // Adjust scale for better resolution, then convert to canvas
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        document.body.removeChild(element);
        pdf.save('invoice.pdf');
    }

    // Event Listeners
    submitCartBtn.addEventListener('click', updateCart); // Ensure summary is updated before invoice generation
    submitInvoiceBtn.addEventListener('click', generateInvoice);

    // Initial render
    renderProducts();
    updateSummary(); // Initial summary calculation

    // Include jsPDF and html2canvas libraries (you'd typically link these in your HTML head)
    const scriptJsPDF = document.createElement('script');
    scriptJsPDF.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(scriptJsPDF);

    const scriptHtml2Canvas = document.createElement('script');
    scriptHtml2Canvas.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(scriptHtml2Canvas);
});