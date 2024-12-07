// Main utility functions
const API_URL = '/library-system/api';

async function makeRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Form validation utility
function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field];
        
        if (rule.required && !value) {
            errors[field] = `${field} is required`;
        }
        
        if (rule.minLength && value.length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
            errors[field] = `${field} format is invalid`;
        }
    }
    
    return errors;
}

 document.addEventListener('DOMContentLoaded', () => {
        // Fetch user count
        fetch('../../api/user.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('totalUsers').textContent = data.users.length;
                }
            })

        // Fetch book count and borrowed books count
        fetch('../../api/book.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('totalBooks').textContent = data.books.length;
                    const borrowedCount = data.books.filter(book => book.status === 'Borrowed').length;
                    document.getElementById('borrowedBooks').textContent = borrowedCount;
                } else {
                    console.error('Error fetching book data:', data.message);
                }
            })

    });
// Alert utility
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Login handler
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const errors = validateForm(
        { username, password },
        {
            username: { required: true },
            password: { required: true, minLength: 6 }
        }
    );
    
    if (Object.keys(errors).length > 0) {
        showAlert(Object.values(errors).join('\n'), 'error');
        return;
    }
    
    try {
        const response = await makeRequest('/library-system/api/auth.php', 'POST', {
            action: 'login',
            username,
            password
        });
        
        if (response.success) {
            window.location.href = response.role === 'admin' ? "/library-system/views/admin/dashboard.php" : "/library-system/views/librarian/borrow_return.php";
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        showAlert('An error occurred during login', 'error');
    }
}

// Logout handler
async function handleLogout() {
    try {
        const response = await makeRequest('/library-system/api/auth.php', 'POST', { action: 'logout' });
        if (response.success) {
            window.location.href = '/library-system/login.php';
        } else {
            showAlert(response.message, 'error');
        }
    } catch (error) {
        showAlert('An error occurred during logout', 'error');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

// Export functions for use in other scripts
window.makeRequest = makeRequest;
window.validateForm = validateForm;
window.showAlert = showAlert;

