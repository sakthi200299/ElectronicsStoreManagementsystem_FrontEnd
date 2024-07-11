function fetchProducts() {
    fetch('http://localhost:8356/product/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products. Server responded with status: ' + response.status);
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            displayProductData(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch products. Please try again later.');
        });
}

function displayProductData(data) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    data.forEach(product => {
        const row = `
            <tr>
                <td>${product.productId}</td>
                <td>${product.serviceTag || ''}</td>
                <td>${product.productName || ''}</td>
                <td>${product.productCost}</td>
                <td>${product.available}</td>
                <td>${product.cgsttax}</td>
                <td>${product.igsttax}</td>
                <td>${product.sgsttax}</td>
                <td><button onclick="selectOrder('${product.productId}', '${product.productName}', '${product.productCost}')">Select Order</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function selectOrder(productId, productName, productCost) {
    const url = `buyingorder.html?productId=${productId}&productName=${encodeURIComponent(productName)}&productCost=${productCost}`;
    window.location.href = url;
}

// Call fetchProducts when the page loads to initially display the products
window.onload = fetchProducts;
