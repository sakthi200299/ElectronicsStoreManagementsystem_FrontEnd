// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to fetch all pending orders for a specific customer
function fetchAllData() {
    const customerId = getUrlParameter('customerId');
    const customerName = getUrlParameter('customerName');

    fetch('http://localhost:8356/ElectronicsStore/orders/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Orders. Server responded with status: ' + response.status);
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(orders => {
            // Filter orders by customerId and status 'pending' and customerName
            const customerOrders = orders.filter(order => {
                return order.customerId === customerId ||
                       order.status === 'pending' &&
                       order.customerName === customerName;
            });

            // Display the filtered orders
            displayData(customerOrders);
        })
        .catch(error => {
            alert('Failed to fetch data. Please try again later.');
        });
}

// Function to display the data in the table
function displayData(data) {
    const tbody = document.getElementById('OrdersTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach(order => {
        const row = `
            <tr>
                <td>${order.orderId}</td>
                <td>${new Date(order.orderDate).toLocaleDateString() || ''}</td>
                <td>${order.orderCost}</td>
                <td>${order.totalQuantity}</td>
                <td>${order.customerName}</td>
                <td>${order.status}</td>
                <td><button class="buy-button" onclick="buyOrder('${order.orderId}', '${order.orderCost}', '${order.customerName}')">Buy</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Function to handle buying an order (redirect to payment.html)
function buyOrder(orderId, orderCost, customerName, customerId) {
    // Construct the URL with all the order details as query parameters
    const url = `payment.html?orderId=${orderId}&orderCost=${orderCost}&customerName=${encodeURIComponent(customerName)}`;
    // Redirect to the constructed URL
    window.location.href = url;
}

// Fetch all pending orders for the specific customer when the page loads
window.onload = fetchAllData;
