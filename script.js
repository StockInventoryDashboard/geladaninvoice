document.addEventListener('DOMContentLoaded', () => {
    const invoiceForm = document.getElementById('invoiceForm');
    const issueDateInput = document.getElementById('issueDate');
    const dueDateInput = document.getElementById('dueDate');
    const cartItemsContainer = document.getElementById('cartItems');
    const submitInvoiceBtn = document.getElementById('submitInvoiceBtn');
    const invoicePaperContainer = document.getElementById('invoicePaperContainer');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const taxesAmountSpan = document.getElementById('taxesAmount');
    const discountAmountSpan = document.getElementById('discountAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const totalGoodsSpan = document.getElementById('totalGoods');

    let cart = [];
    const products = [
        { id: 1, name: "Premium Web Hosting (1 Year)", price: 12000 },
        { id: 2, name: "Domain Registration (.com, 1 Year)", price: 8000 },
        { id: 3, name: "SSL Certificate (Basic)", price: 5000 },
        { id: 4, name: "Website Design Package (Starter)", price: 75000 },
        { id: 5, name: "E-commerce Integration", price: 50000 },
        { id: 6, name: "SEO Optimization (Monthly)", price: 30000 },
        { id: 7, name: "Social Media Management (Monthly)", price: 25000 },
        { id: 8, name: "Content Creation (5 Articles)", price: 20000 },
        { id: 9, name: "Custom Software Development (Per Hour)", price: 15000 },
        { id: 10, name: "IT Support (On-demand)", price: 10000 },
        { id: 11, name: "Cybersecurity Audit", price: 40000 },
        { id: 12, name: "Cloud Storage (1TB, 1 Year)", price: 18000 },
        { id: 13, name: "Graphic Design (Logo & Branding)", price: 35000 },
        { id: 14, name: "Video Production (30-sec Ad)", price: 60000 },
        { id: 15, name: "Mobile App Development (Basic)", price: 100000 },
    ];

    // Initialize dates
    const today = new Date();
    issueDateInput.value = today.toISOString().split('T')[0];
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    dueDateInput.value = thirtyDaysLater.toISOString().split('T')[0];

    // Render products
    function renderProducts() {
        cartItemsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');
            productDiv.innerHTML = `
                <span>${product.name} - ₦${product.price.toLocaleString()}</span>
                <input type="number" min="0" value="0" data-product-id="${product.id}" class="product-quantity">
            `;
            cartItemsContainer.appendChild(productDiv);
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

        const taxes = 0; // 0% tax
        const discount = 0; // No discount for now

        const totalAmount = subtotal + taxes - discount;

        subtotalAmountSpan.textContent = `₦${subtotal.toLocaleString()}`;
        taxesAmountSpan.textContent = `₦${taxes.toLocaleString()}`;
        discountAmountSpan.textContent = `₦${discount.toLocaleString()}`;
        totalAmountSpan.textContent = `₦${totalAmount.toLocaleString()}`;
        totalGoodsSpan.textContent = totalGoods;
    }

    function generateTicketId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    submitInvoiceBtn.addEventListener('click', () => {
        if (!invoiceForm.checkValidity()) {
            invoiceForm.reportValidity();
            return;
        }
        if (cart.length === 0) {
            alert('Please select at least one product.');
            return;
        }

        const buyerName = document.getElementById('buyerName').value;
        const buyerAddress = document.getElementById('buyerAddress').value;
        const buyerContact = document.getElementById('buyerContact').value;
        const issueDate = issueDateInput.value;
        const dueDate = dueDateInput.value;
        const sellerInfo = document.getElementById('sellerInfo').value.replace(/\n/g, '<br>');
        const ticketId = generateTicketId();

        let itemsTableHtml = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>₦${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const invoiceHtml = `
            <div class="invoice-paper" style="width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; font-family: 'Arial', sans-serif; font-size: 10pt; background: url('https://i.imgur.com/your-canva-background-image.jpg') no-repeat center center; background-size: cover; color: #333; position: relative;">
                <div style="text-align: center; margin-bottom: 20mm;">
                    <h1 style="color: #007bff; margin-bottom: 5px;">GELADAN RESOURCES</h1>
                    <p style="font-size: 11pt; color: #555;">INVOICE</p>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 15mm;">
                    <div style="width: 48%;">
                        <h4 style="color: #007bff; margin-bottom: 5px;">SELLER INFO:</h4>
                        <p>${sellerInfo}</p>
                    </div>
                    <div style="width: 48%; text-align: right;">
                        <h4 style="color: #007bff; margin-bottom: 5px;">INVOICE FOR:</h4>
                        <p><strong>Ticket ID:</strong> ${ticketId}</p>
                        <p><strong>Issue Date:</strong> ${issueDate}</p>
                        <p><strong>Due Date:</strong> ${dueDate}</p>
                    </div>
                </div>

                <div style="margin-bottom: 20mm;">
                    <h4 style="color: #007bff; margin-bottom: 5px;">BILLED TO:</h4>
                    <p><strong>Name/Business:</strong> ${buyerName}</p>
                    <p><strong>Address:</strong> ${buyerAddress}</p>
                    <p><strong>Contact:</strong> ${buyerContact}</p>
                </div>

                <h4 style="color: #007bff; margin-bottom: 10px;">ITEM DETAILS:</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20mm;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Unit Price</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsTableHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${subtotalAmountSpan.textContent}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Taxes (0%):</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${taxesAmountSpan.textContent}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Discount:</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${discountAmountSpan.textContent}</td>
                        </tr>
                        <tr style="background-color: #e6f2ff;">
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold; font-size: 12pt;">TOTAL AMOUNT:</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; font-size: 12pt;">${totalAmountSpan.textContent}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-bottom: 20mm;">
                    <h4 style="color: #007bff; margin-bottom: 5px;">BANK ACCOUNT DETAILS:</h4>
                    <p><strong>BANK:</strong> UBA Bank</p>
                    <p><strong>ACCOUNT NAME:</strong> Uzoma Angela</p>
                    <p><strong>ACCOUNT NUMBER:</strong> 2090487949</p>
                    <p><strong>CURRENCY:</strong> ₦ NAIRA</p>
                </div>

                <div style="text-align: center; margin-top: 30mm; border-top: 1px solid #eee; padding-top: 10mm; font-size: 9pt; color: #777;">
                    <p>Office Address: No.20 A line Ariaria, Aba, Abia State | Phone: 09068420849</p>
                    <p>Payment Terms: Net 30 days | Refund policies as per agreement.</p>
                    <p>Thank you for your business!</p>
                </div>
            </div>
        `;

        invoicePaperContainer.innerHTML = invoiceHtml;
        invoicePaperContainer.style.display = 'block';

        const downloadButtonsHtml = `
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn download-img-btn" data-format="png" style="margin-right: 10px;">Download as PNG</button>
                <button class="btn download-img-btn" data-format="jpeg">Download as JPEG</button>
            </div>
        `;
        invoicePaperContainer.insertAdjacentHTML('beforeend', downloadButtonsHtml);

        document.querySelectorAll('.download-img-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const format = event.target.dataset.format;
                downloadInvoiceAsImage(format);
            });
        });

        // Scroll to the generated invoice
        invoicePaperContainer.scrollIntoView({ behavior: 'smooth' });
    });

    function downloadInvoiceAsImage(format = 'png') {
        const invoiceElement = invoicePaperContainer.querySelector('.invoice-paper');
        if (!invoiceElement) {
            alert('No invoice to download!');
            return;
        }

        html2canvas(invoiceElement, {
            scale: 2, // Increase scale for better resolution
            useCORS: true, // Important if using external images in Canva background
            logging: true,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Geladan_Resources_Invoice_${generateTicketId()}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 0.9); // 0.9 for JPEG quality
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert(`Invoice downloaded as ${format.toUpperCase()}!`);
        }).catch(error => {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        });
    }

    renderProducts();
    updateSummary(); // Initial summary calculation
});
