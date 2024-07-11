// Function to add a new customer
function addCustomer(event) {
    event.preventDefault();

  
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerPassword = document.getElementById('customerPassword').value;

    if (customerName.trim() === '' || customerPhone.trim() === '' || customerPassword.trim() === '') {
        alert('Please fill out all fields');
        return;
    }

    const newCustomer = {
      
        customerName: customerName,
        customerPhone: customerPhone,
        customerPassword: customerPassword
    };

    fetch('http://localhost:8356/ElectronicsStore/customer/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('add customer');
        }
        return response.json();
    })
    .then(data => {
       
       
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerPassword').value = '';
    })
    .catch(error => {
        console.error('Error adding customer:', error);
        alert('Customer added successfully');
    });
}

// Function to update an existing customer
function updateCustomer(event) {
    event.preventDefault();

    const updateCustomerId = document.getElementById('updateCustomerId').value;
    const updateCustomerName = document.getElementById('updateCustomerName').value;
    const updateCustomerPhone = document.getElementById('updateCustomerPhone').value;
    const updateCustomerPassword = document.getElementById('updateCustomerPassword').value;

    fetch(`http://localhost:8356/ElectronicsStore/customer/update/${updateCustomerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customerName: updateCustomerName,
            customerPhone: updateCustomerPhone,
            customerPassword: updateCustomerPassword
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Customer updated successfully');
            document.getElementById('updateCustomerId').value = '';
            document.getElementById('updateCustomerName').value = '';
            document.getElementById('updateCustomerPhone').value = '';
            document.getElementById('updateCustomerPassword').value = '';
        } else {
            throw new Error('update customer');
        }
    })
    .catch(error => {
        console.error('Error updating customer:', error);
        alert('Failed to update customer. Please try again later.');
    });
}

// Function to delete an existing customer
function deleteCustomer(event) {
    event.preventDefault();

    const deleteCustomerId = document.getElementById('deleteCustomerId').value;

    fetch(`http://localhost:8356/ElectronicsStore/customer/delete/${deleteCustomerId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Customer deleted successfully');
            document.getElementById('deleteCustomerId').value = '';
        } else {
            throw new Error('delete customer');
        }
    })
    .catch(error => {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer. Please try again later.');
    });
}
