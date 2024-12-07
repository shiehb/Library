// Report generation functions

function getBooksByStatus(status = null) {
    let url = '/library-system/api/report.php';
    if (status) {
        url += `?status=${encodeURIComponent(status)}`;
    }
    
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.books;
            } else {
                throw new Error(data.message);
            }
        });
}

function generatePDF(books) {
    const doc = new jsPDF();
    doc.text("Book Report", 10, 10);
    
    let yPos = 20;
    books.forEach((book, index) => {
        doc.text(`${index + 1}. ${book.title} by ${book.author} - Status: ${book.status}`, 10, yPos);
        yPos += 10;
        
        // Check if the position exceeds the page limit
        if (yPos > 280) {
            doc.addPage();
            yPos = 20; // Reset yPos for the new page
        }
    });
    
    // Save the PDF
    doc.save("book_report.pdf");

    // Notify the user that the PDF was successfully created
    alert("PDF report has been successfully created!");
}

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('statusFilter');
    const generateReportBtn = document.getElementById('generateReport');
    const bookTableBody = document.getElementById('bookTableBody'); statusFilter.addEventListener('change', () => {
        getBooksByStatus(statusFilter.value)
            .then(books => displayBooks(books))
            .catch(error => console.error("Error fetching books:", error));
    });
    
    generateReportBtn.addEventListener('click', () => {
        getBooksByStatus(statusFilter.value)
            .then(books => generatePDF(books))
            .catch(error => console.error("Error generating report:", error));
    });
    
});

function displayBooks(books) {
    const bookTableBody = document.getElementById('bookTableBody');
    bookTableBody.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.status}</td>`;
        bookTableBody.appendChild(row);
    });
}

function generatePDF(books) {
    const doc = new jsPDF();
    doc.text("Book Report", 10, 10);
    
    let yPos = 20;
    books.forEach((book, index) => {
        doc.text(`${index + 1}. ${book.title} by ${book.author} - Status: ${book.status}`, 10, yPos);
        yPos += 10;
        
        // Check if the position exceeds the page limit
        if (yPos > 280) {
            doc.addPage();
            yPos = 20; // Reset yPos for the new page
        }
    });
    
    // Save the PDF
    doc.save("book_report.pdf");

    // Show custom notification
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}


// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('statusFilter');
    const generateReportBtn = document.getElementById('generateReport');
    
    statusFilter.addEventListener('change', () => {
        getBooksByStatus(statusFilter.value)
            .then(books => displayBooks(books))
    });
    
    generateReportBtn.addEventListener('click', () => {
        getBooksByStatus(statusFilter.value)
            .then(books => generatePDF(books))
    });
    
    // Initial load of all books
    getBooksByStatus()
        .then(books => displayBooks(books))
});

function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author} - Status: ${book.status}`;
        bookList.appendChild(li);
    });
}
 //`/assets/js/main.js`:

//```javascript
// Utility functions and general scripts

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

function showModal(title, message) {
    const modal = document.getElementById('alertModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    modalTitle.textContent = title;
    modalBody.textContent = message;

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm('loginForm')) {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                fetch('/library-system/api/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = data.role === 'admin' ? '/library-system/views/admin/dashboard.php' : '/library-system/views/librarian/borrow_return.php';
                    } else {
                        showModal('Login Failed', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showModal('Error', 'An unexpected error occurred. Please try again.');
                });
            }
        });
    }
});

