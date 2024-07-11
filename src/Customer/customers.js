// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to populate input fields with URL parameters when the page loads
function populateFormFields() {
    const customerName = getUrlParameter('customerName');
    const productId = getUrlParameter('productId');
    const productName = getUrlParameter('productName');
    const productCost = getUrlParameter('productCost');
    const customerId = getUrlParameter('customerId');

    if (customerName) {
        document.getElementById('customerName').value = customerName;
    }

    if (productId) {
        document.getElementById('productId').value = productId;
    }

    if (productName) {
        document.getElementById('productName').value = productName;
    }

    if (productCost) {
        document.getElementById('productCost').value = productCost;
    }

    if (customerId) {
        document.getElementById('customerid').value = customerId;
    }
}

// Function to handle form submission
function addOrder(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const orderCost = document.getElementById('productCost').value;
    const totalQuantity = document.getElementById('totalQuantity').value;
    const customerId = document.getElementById('customerid').value;

    if (customerName.trim() === '' || totalQuantity.trim() === '' || totalQuantity <=0) {
        alert('Please fill out all fields with valid data');
        return;
    }

    const newOrder = {
        customerName: customerName,
        productId: productId,
        productName: productName,
        totalQuantity: totalQuantity,
        orderCost: orderCost,
        customerId: customerId,
        status: 'pending'
    };

    // Example of sending the product request
    const requestParams = `?productId=${productId}&totalQuantity=${totalQuantity}&customerId=${customerId}`;
    const url = 'http://localhost:8356/ElectronicsStore/product/requestforproduct' + requestParams;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to request product');
        }
        return response.json();
    })
    .then(data => {
        alert('Product request sent successfully');
        document.getElementById('addOrderForm').reset();
        redirectToOrderBuyingPage(customerId, customerName);
    })
    .catch(error => {
        alert('Failed to request product');
    });
}

// Function to clear all input fields in the form
function clearFormFields() {
    document.getElementById('addOrderForm').reset();
}

// Function to redirect to orderbuying.html with customerId and customerName parameters
function redirectToOrderBuyingPage(customerId, customerName) {
    const url = `../order/orderbuying.html?customerId=${customerId}&customerName=${encodeURIComponent(customerName)}`;
    window.location.href = url;
}

// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    populateFormFields(); // Populate form fields when the page loads

    // Event listener for form submission
    document.getElementById('addOrderForm').addEventListener('submit', addOrder);

    // Event listener for cancel button
    document.getElementById('cancelButton').addEventListener('click', clearFormFields);
});
