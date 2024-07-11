// Function to get query parameters from the URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
}

// Set the hidden input fields with the query parameters
function setCustomerInfo() {
    const params = getQueryParams();
    if (params.customerId) {
        document.getElementById('customerId').value = params.customerId;
    }
    if (params.customerName) {
        document.getElementById('customerName').value = params.customerName;
    }
}

// Function to select order and redirect with product and customer details
function selectOrder(productId, productName, productCost) {
    const customerId = document.getElementById('customerId').value;
    const customerName = document.getElementById('customerName').value;
    const encodedCustomerName = encodeURIComponent(customerName);
    const url = `../Customer/customers.html?productId=${productId}&productName=${encodeURIComponent(productName)}&productCost=${productCost}&customerId=${customerId}&customerName=${encodedCustomerName}`;
    window.location.href = url;
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();

    const serviceTag = document.getElementById('serviceTag').value;
    const productName = document.getElementById('productName').value;
    const productCost = document.getElementById('productCost').value;

    if (serviceTag.trim() === '' || productName.trim() === '' || productCost.trim() === '') {
        alert('Please fill out all fields');
        return;
    }

    const newProduct = {
        serviceTag: serviceTag,
        productName: productName,
        productCost: parseFloat(productCost)
    };

    fetch('http://localhost:8356/ElectronicsStore/product/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add product');
        }
        return response.json();
    })
    .then(data => {
        alert('Product added successfully');
        document.getElementById('serviceTag').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productCost').value = '';
        fetchProducts(); // Refresh product list after adding
    })
    .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
    });
}

// Function to update a product
function updateProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('updateProductId').value;
    const serviceTag = document.getElementById('updateServiceTag').value;
    const productName = document.getElementById('updateProductName').value;
    const productCost = document.getElementById('updateProductCost').value;

    fetch(`http://localhost:8356/ElectronicsStore/product/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            serviceTag: serviceTag,
            productName: productName,
            productCost: parseFloat(productCost)
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Product updated successfully');
            fetchProducts(); // Refresh product list after update
        } else {
            throw new Error('Failed to update product');
        }
    })
    .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
    });
}

// Function to delete a product
function deleteProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('deleteProductId').value;

    if (!productId) {
        alert('Please enter a product ID');
        return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://localhost:8356/ElectronicsStore/product/delete/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Product deleted successfully');
                fetchProducts(); // Refresh product list after deletion
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        });
    }
}

// Function to fetch and display products
function fetchProducts() {
    fetch('http://localhost:8356/ElectronicsStore/product/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            displayProductData(data); // Pass the entire data object to display function
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch products. Please try again later.');
        });
}

// Function to display product data
function displayProductData(data) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    // Check if data is an array
    if (!Array.isArray(data)) {
        console.error('Expected an array of products, but received:', data);
        alert('Failed to display products. Data format error.');
        return;
    }

    // Iterate over each product in the array
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
                 <td><button onclick="selectOrder(${product.productId}, '${product.productName}', ${product.productCost}, ${product.available})">ADD TO CART</button></td> 
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Event listeners for form submissions (wrapped in DOMContentLoaded event listener)
document.addEventListener('DOMContentLoaded', function() {
    setCustomerInfo();
    fetchProducts();
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    document.getElementById('updateProductForm').addEventListener('submit', updateProduct);
    document.getElementById('deleteProductForm').addEventListener('submit', deleteProduct);
});
