// Function to add a new order
function addOrder(event) {
    event.preventDefault();

  
    const orderCost = document.getElementById('orderCost').value;
    const totalQuantity = document.getElementById('totalQuantity').value;
    const customerName = document.getElementById('customerName').value;

    if (customerid.trim() === '' || orderCost.trim() === '' || totalQuantity.trim() === '' || customerName.trim() === '') {
        alert('Please fill out all fields');
        return;
    }

    const newOrder = {
   
        orderCost: orderCost*totalQuantity,
        totalQuantity: totalQuantity,
        customerName: customerName,
        status: 'pending'
    };

    fetch('http://localhost:8356/ElectronicsStore/orders/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add order');
        }
        return response.json();
    })
    .then(data => {
        alert('Order added successfully');
        document.getElementById('customerid').value = '';
        document.getElementById('orderCost').value = '';
        document.getElementById('totalQuantity').value = '';
        document.getElementById('customerName').value = '';
    })
    .catch(error => {
        console.error('Error adding order:', error);
        alert('order add.');
    });
}

// Function to update an existing order
function updateOrder(event) {
    event.preventDefault();

    const updateOrderId = document.getElementById('updateOrderId').value;
    const updateOrderCost = document.getElementById('updateOrderCost').value;
    const updateTotalQuantity = document.getElementById('updateTotalQuantity').value;
    const updateCustomerName = document.getElementById('updateCustomerName').value;

    fetch(`http://localhost:8356/ElectronicsStore/orders/update/${updateOrderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        
            orderCost: updateOrderCost,
            totalQuantity: updateTotalQuantity,
            customerName: updateCustomerName,
            status: 'pending'
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Order updated successfully');
            document.getElementById('updateCustomerId').value = '';
            document.getElementById('updateOrderCost').value = '';
            document.getElementById('updateTotalQuantity').value = '';
            document.getElementById('updateCustomerName').value = '';
        } else {
            throw new Error('Failed to update order');
        }
    })
    .catch(error => {
        console.error('Error updating order:', error);
        alert('Failed to update order. Please try again later.');
    });
}

// Function to delete an existing order
function deleteOrder(event) {
    event.preventDefault();

    const deleteOrderId = document.getElementById('deleteOrderId').value;

    fetch(`http://localhost:8356/ElectronicsStore/orders/delete/${deleteOrderId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Order deleted successfully');
            document.getElementById('deleteOrderId').value = '';
        } else {
            throw new Error('Failed to delete order');
        }
    })
    .catch(error => {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again later.');
    });
}
// Function to fetch all data
function fetchAllData() {
    fetch('http://localhost:8356/ElectronicsStore/orders/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Orders. Server responded with status: ' + response.status);
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(orders => {
            // Display the data
            displayData(orders);
        })
        .catch(error => {
            alert('Failed to fetch data. Please try again later.');
        });
}

// Function to display the data in the table
function displayData(data) {
    const tbody = document.getElementById('OrdersTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.orderId}</td>
                <td>${new Date(item.orderDate).toLocaleString() || ''}</td>
                <td>${item.orderCost}</td>
                <td>${item.totalQuantity}</td>
                <td>${item.customerName}</td>
                <td>${item.status}</td>
                <td>
                <button class="btn" onclick="approveOrder(${item.orderId})">Approve</button>
                <button class="btn" onclick="cancelOrder(${item.orderId})">Cancel</button>
            </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Function to approve an order
function approveOrder(orderId) {
    fetch(`http://localhost:8356/ElectronicsStore/orders/approve/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to approve order');
        }
        return response.json();
    })
    .then(data => {
        alert('Order approved successfully');
        fetchAllData(); // Refresh the data
    })
    .catch(error => {
        console.error('Error approving order:', error);
        alert('Failed to approve order. Please try again later.');
    });
}

// Fetch all data when the page loads
window.onload = fetchAllData;

