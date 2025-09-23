document.addEventListener('DOMContentLoaded', () => {
    const invoiceForm = document.getElementById('invoiceForm');
    const issueDateInput = document.getElementById('issueDate');
    const dueDateInput = document.getElementById('dueDate');
    const buyerNameInput = document.getElementById('buyerName');
    const buyerAddressInput = document.getElementById('buyerAddress');
    const buyerContactInput = document.getElementById('buyerContact');
    const cartItemsDiv = document.getElementById('cartItems');
    const submitInvoiceBtn = document.getElementById('submitInvoiceBtn');
    const invoicePaperContainer = document.getElementById('invoicePaperContainer');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const taxesAmountSpan = document.getElementById('taxesAmount');
    const discountAmountSpan = document.getElementById('discountAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const totalGoodsSpan = document.getElementById('totalGoods');

    let cart = [];
    const products = [
        { id: 1, name: 'Infix Smart 6', price: 180000 },
        { id: 2, name: 'Samsung A16', price: 280000 },
        { id: 3, name: 'Samsung S6', price: 320000 },
        { id: 4, name: 'Infix Smart 8', price: 200000 },
        { id: 4, name: 'Hytel Pro', price: 220000 }
    ];

    // Populate products in the cart section
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

        const taxes = 0; // 0% tax
        const discount = 0; // No discount for now
        const total = subtotal + taxes - discount;

        subtotalAmountSpan.textContent = `₦${subtotal.toLocaleString()}`;
        taxesAmountSpan.textContent = `₦${taxes.toLocaleString()}`;
        discountAmountSpan.textContent = `₦${discount.toLocaleString()}`;
        totalAmountSpan.textContent = `₦${total.toLocaleString()}`;
        totalGoodsSpan.textContent = totalGoods;
    }

    function generateTicketId() {
        return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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

        const ticketId = generateTicketId();
        const issueDate = issueDateInput.value;
        const dueDate = dueDateInput.value;
        const buyerName = buyerNameInput.value;
        const buyerAddress = buyerAddressInput.value;
        const buyerContact = buyerContactInput.value;
        const sellerInfo = document.getElementById('sellerInfo').value;

        let invoiceItemsHtml = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>₦${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const invoiceHtml = `
            <div class="invoice-paper">
                <header class="invoice-header">
                    <h1>GELADAN RESOURCES</h1>
                    <p>${sellerInfo.replace(/\n/g, '<br>')}</p>
                </header>
                <div class="invoice-details">
                    <div>
                        <strong>INVOICE #</strong><br>
                        ${ticketId}
                    </div>
                    <div>
                        <strong>Issue Date:</strong> ${issueDate}<br>
                        <strong>Due Date:</strong> ${dueDate}
                    </div>
                </div>
                <div class="invoice-billto">
                    <h3>Bill To:</h3>
                    <p><strong>${buyerName}</strong></p>
                    <p>${buyerAddress}</p>
                    <p>${buyerContact}</p>
                </div>
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceItemsHtml}
                    </tbody>
                </table>
                <div class="invoice-summary-paper">
                    <p>Subtotal: <span class="amount">₦${subtotalAmountSpan.textContent.replace('₦', '')}</span></p>
                    <p>Taxes (0%): <span class="amount">₦${taxesAmountSpan.textContent.replace('₦', '')}</span></p>
                    <p>Discount: <span class="amount">₦${discountAmountSpan.textContent.replace('₦', '')}</span></p>
                    <h3>Total Amount: <span class="amount">₦${totalAmountSpan.textContent.replace('₦', '')}</span></h3>
                </div>
                <div class="invoice-bank-details">
                    <h3>Bank Account Details</h3>
                    <p><strong>BANK:</strong> UBA Bank</p>
                    <p><strong>ACCOUNT NAME:</strong> Uzoma Angela</p>
                    <p><strong>ACCOUNT NUMBER:</strong> 2090487949</p>
                    <p><strong>CURRENCY:</strong> ₦ NAIRA</p>
                </div>
                <div class="invoice-footer">
                    <p>Payment Terms: Net 30 days</p>
                    <p>Refund policies as per agreement.</p>
                </div>
            </div>
            <div class="download-buttons">
                <button class="btn download-btn" id="downloadPngBtn">Download as PNG</button>
                <button class="btn download-btn" id="downloadPdfBtn">Download as PDF</button>
            </div>
        `;

        invoicePaperContainer.innerHTML = invoiceHtml;
        invoicePaperContainer.style.display = 'block';

        const downloadPngBtn = document.getElementById('downloadPngBtn');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');

        downloadPngBtn.addEventListener('click', () => downloadInvoice('png'));
        downloadPdfBtn.addEventListener('click', () => downloadInvoice('pdf'));
    });

    async function downloadInvoice(format) {
        const invoicePaper = document.querySelector('.invoice-paper');
        const originalDisplay = invoicePaper.style.display;
        invoicePaper.style.display = 'block'; // Ensure it's visible for capture

        try {
            const canvas = await html2canvas(invoicePaper, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            if (format === 'png' || format === 'jpg') {
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `invoice-${generateTicketId()}.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (format === 'pdf') {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`invoice-${generateTicketId()}.pdf`);
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Failed to generate invoice. Please try again.');
        } finally {
            invoicePaper.style.display = originalDisplay; // Restore original display
        }
    }

    // Initialize
    renderProducts();
    updateSummary();

    // Dynamically load jsPDF for PDF generation
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
});
