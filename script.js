document.addEventListener('DOMContentLoaded', () => {
    const invoiceForm = document.getElementById('invoiceForm');
    const cartItemsDiv = document.getElementById('cartItems');
    const submitInvoiceBtn = document.getElementById('submitInvoiceBtn');
    const invoicePaperContainer = document.getElementById('invoicePaperContainer');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const taxesAmountSpan = document.getElementById('taxesAmount');
    const discountAmountSpan = document.getElementById('discountAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const totalGoodsSpan = document.getElementById('totalGoods');

    let products = [
        { id: 1, name: "Fan (1 unit)", price: 10000 },
        { id: 2, name: "OX fan (1 unit)", price: 15000 },
        { id: 3, name: "Lantern (1 unit)", price: 20000 },
        { id: 4, name: "Touch (1 unit)", price: 5000 },
        { id: 5, name: "Battery (1 unit)", price: 15000 },
        { id: 6, name: "Smart Watch (1 unit)", price: 35000 },
        { id: 7, name: "Power Bank (1 unit)", price: 40000 },
        { id: 8, name: "Extension Socket (1 unit)", price: 5000 },
        { id: 9, name: "30mm Cable (1 unit)", price: 25000 },
        { id: 10, name: "Cmos Battery (1 unit)", price: 5500 },
    ];

    let cart = [];

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
                if (product) {
                    cart.push({ ...product, quantity });
                }
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

        const taxes = subtotal * 0; // 0% tax
        const discount = 0; // No discount for now
        const total = subtotal + taxes - discount;

        subtotalAmountSpan.textContent = `₦${subtotal.toLocaleString()}`;
        taxesAmountSpan.textContent = `₦${taxes.toLocaleString()}`;
        discountAmountSpan.textContent = `₦${discount.toLocaleString()}`;
        totalAmountSpan.textContent = `₦${total.toLocaleString()}`;
        totalGoodsSpan.textContent = totalGoods;
    }

    function generateTicketID() {
        return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    submitInvoiceBtn.addEventListener('click', () => {
        const issueDate = document.getElementById('issueDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const buyerName = document.getElementById('buyerName').value;
        const buyerAddress = document.getElementById('buyerAddress').value;
        const buyerContact = document.getElementById('buyerContact').value;
        const sellerInfo = document.getElementById('sellerInfo').value;
        const invoiceHeader = document.getElementById('invoiceHeader').value;

        if (!issueDate || !dueDate || !buyerName || !buyerAddress || !buyerContact || cart.length === 0) {
            alert('Please fill in all buyer details, select products, and ensure issue/due dates are set.');
            return;
        }

        const ticketID = generateTicketID();

        let invoiceItemsHtml = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>₦${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const subtotal = parseFloat(subtotalAmountSpan.textContent.replace('₦', '').replace(/,/g, ''));
        const taxes = parseFloat(taxesAmountSpan.textContent.replace('₦', '').replace(/,/g, ''));
        const discount = parseFloat(discountAmountSpan.textContent.replace('₦', '').replace(/,/g, ''));
        const total = parseFloat(totalAmountSpan.textContent.replace('₦', '').replace(/,/g, ''));

        const invoiceHtml = `
            <div class="invoice-paper">
                <div class="invoice-header-paper">
                    <h1 style="color: #4CAF50;">${invoiceHeader}</h1>
                    <p><strong>Ticket ID:</strong> ${ticketID}</p>
                </div>
                <div class="invoice-details-paper">
                    <div class="invoice-info-section">
                        <div>
                            <p><strong>Invoice No:</strong> INV-${Date.now()}</p>
                            <p><strong>Issue Date:</strong> ${issueDate}</p>
                            <p><strong>Due Date:</strong> ${dueDate}</p>
                        </div>
                        <div class="paper">
                        <div>
                            <p><strong>Seller:</strong></p>
                            <pre>${sellerInfo}</pre>
                        </div>
                    </div>
                    <div class="invoice-buyer-section">
                        <p><strong>Bill To:</strong></p>
                        <p>${buyerName}</p>
                        <p>${buyerAddress}</p>
                        <p>${buyerContact}</p>
                    </div>
                    </div>
                </div>
                <h3 style="color: #4CAF50;">Items Purchased</h3>
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceItemsHtml}
                    </tbody>
                </table>
                <div class="invoice-summary-paper">
                    <p>Subtotal: ₦${subtotal.toLocaleString()}</p>
                    <p>Taxes (0%): ₦${taxes.toLocaleString()}</p>
                    <p>Discount: ₦${discount.toLocaleString()}</p>
                    <h3>Total Amount: ₦${total.toLocaleString()}</h3>
                </div>
                <div class="bank-details-paper">
                    <h3>Bank Account Details</h3>
                    <p><strong>BANK:</strong> UBA Bank</p>
                    <p><strong>ACCOUNT NAME:</strong> Uzoma Angela</p>
                    <p><strong>ACCOUNT NUMBER:</strong> 2090487949</p>
                    <p><strong>CURRENCY:</strong> ₦ NAIRA</p>
                </div>
                <div class="invoice-footer-paper">
                    <p>Thank you for your business!</p>
                    <p>Office Address: No.20 A line Ariaria, Aba, Abia State | Phone: 09068420849</p>
                    <p>Payment Terms: Net 30 days | Refund policies as per agreement.</p>
                </div>
                <div class="download-options">
                    <button class="btn download-btn" data-format="png">Download as PNG</button>
                    <button class="btn download-btn" data-format="jpg">Download as JPG</button>
                </div>
            </div>
        `;

        invoicePaperContainer.innerHTML = invoiceHtml;
        invoicePaperContainer.style.display = 'block';

        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const format = event.target.dataset.format;
                downloadInvoiceAsImage(format);
            });
        });

        alert(`Invoice created successfully! Your Ticket ID is: ${ticketID}`);
        // Consider clearing the form or resetting cart after submission
    });

    async function downloadInvoiceAsImage(format = 'png') {
        const invoicePaper = document.querySelector('.invoice-paper');
        if (!invoicePaper) {
            alert('No invoice to download.');
            return;
        }

        const options = {
            scale: 2, // Increase scale for better quality
            useCORS: true, // If any images are loaded from external sources
        };

        try {
            const canvas = await html2canvas(invoicePaper, options);
            const image = canvas.toDataURL(`image/${format}`);

            const link = document.createElement('a');
            link.href = image;
            link.download = `invoice-${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert(`Invoice downloaded as .${format} successfully!`);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        }
    }

    renderProducts();
    updateSummary(); // Initialize summary
});
