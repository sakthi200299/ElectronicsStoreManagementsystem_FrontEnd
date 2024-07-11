document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const customerPasswordInput = document.getElementById('customerPassword');

    const customerNameError = document.getElementById('customerNameError');
    const customerPhoneError = document.getElementById('customerPhoneError');
    const customerPasswordError = document.getElementById('customerPasswordError');

    if (!signupForm || !customerNameInput || !customerPhoneInput || !customerPasswordInput || !customerNameError || !customerPhoneError || !customerPasswordError) {
        console.error('Required elements not found.');
        return;
    }

    signupForm.addEventListener('submit', event => {
        event.preventDefault();

        const customerName = customerNameInput.value.trim();
        const customerPhone = customerPhoneInput.value.trim();
        const customerPassword = customerPasswordInput.value;

        let isValid = true;

        // Reset previous errors
        customerNameError.textContent = '';
        customerPhoneError.textContent = '';
        customerPasswordError.textContent = '';

        // Validation checks
        if (customerPhone.length !== 10) {
            customerPhoneError.textContent = 'Phone number must be exactly 10 digits.';
            isValid = false;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(customerPassword)) {
            customerPasswordError.textContent = 'Password must be at least 8 characters long, contain letters, numbers, and at least one special character.';
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        checkUsernameExists(customerName)
            .then(exists => {
                if (exists) {
                    customerNameError.textContent = 'Username already exists. Please choose a different username.';
                    return;
                }

                const userData = {
                    customerName: customerName,
                    customerPhone: customerPhone,
                    customerPassword: customerPassword,
                    role: 'user' // Set the role to 'user' by default
                };

                // Simulate user creation
                fetch('http://localhost:8356/ElectronicsStore/customer/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error creating user');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User created:', data);
                    alert('User created successfully!');
                    window.location.href = 'login.html'; // Redirect to login.html after successful signup
                })
                .catch(error => {
                    alert('Creating user');
                });
            })
            .catch(error => {
                console.error('Error checking username:', error);
                customerNameError.textContent = 'Error checking username. Please try again later.';
            });
    });

    customerPhoneInput.addEventListener('input', () => {
        // Limit the input length to 10 characters
        if (customerPhoneInput.value.length > 10) {
            customerPhoneInput.value = customerPhoneInput.value.slice(0, 10);
        }

        if (customerPhoneInput.value.length !== 10) {
            customerPhoneError.textContent = 'Phone number must be exactly 10 digits.';
        } else {
            customerPhoneError.textContent = ''; // Clear error if input is valid
        }
    });

    customerPasswordInput.addEventListener('input', () => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(customerPasswordInput.value)) {
            customerPasswordError.textContent = 'Password must be at least 8 characters long, contain letters, numbers, and at least one special character.';
        } else {
            customerPasswordError.textContent = ''; // Clear error if input is valid
        }
    });

    customerNameInput.addEventListener('input', () => {
        const customerName = customerNameInput.value.trim();

        if (customerName.length > 0) {
            checkUsernameExists(customerName)
                .then(exists => {
                    if (exists) {
                        customerNameError.textContent = 'Username already exists. Please choose a different username.';
                    } else {
                        customerNameError.textContent = 'Username is available.';
                    }
                })
                .catch(error => {
                    console.error('Error checking username:', error);
                    customerNameError.textContent = 'Error checking username. Please try again later.';
                });
        } else {
            customerNameError.textContent = ''; // Clear error if input is empty
        }
    });

    function checkUsernameExists(username) {
        return fetch(`http://localhost:8356/ElectronicsStore/customer/name/${username}`)
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => !!data); // Username exists
                } else if (response.status === 404) {
                    return false; // Username does not exist
                } else {
                    throw new Error('Error checking username');
                }
            });
    }
});
