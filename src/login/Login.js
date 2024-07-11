// Function to handle authentication
function authenticateUser(username, password) {
    const loginData = {
        customerName: username,
        customerPassword: password
    };

    return fetch('http://localhost:8356/ElectronicsStore/customer/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Authentication failed');
            });
        }
        return response.json();
    });
}

// Function to fetch customer data and get customer ID and role
function fetchCustomerData(username) {
    return fetch(`http://localhost:8356/ElectronicsStore/customer/name/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customer data');
        }
        return response.json();
    })
    .then(customer => {
        if (!customer) {
            throw new Error('Customer not found');
        }
        return { customerId: customer.customerId, role: customer.role };
    });
}

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    authenticateUser(username, password)
    .then(data => {
        if (data.message === "Authentication successful") {
            return fetchCustomerData(username)
            .then(customerData => {
                if (customerData.role === "user") {
                    // Redirect users to index.html with customerId and customerName in the query string
                    window.location.href = `../product/index.html?customerId=${customerData.customerId}&customerName=${encodeURIComponent(username)}`;
                } else if (customerData.role === "admin") {
                    // Redirect admins to Admincrud.html with customerId and customerName in the query string
                    window.location.href = `Admincrud.html?customerId=${customerData.customerId}&customerName=${encodeURIComponent(username)}`;
                } else {
                    throw new Error('Invalid user role');
                }
            });
        } else {
            throw new Error('Login failed. Please check your username and password.');
        }
    })
    .catch(error => {
        alert(error.message || 'Login failed. Please try again.');
    });
});
