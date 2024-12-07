// Book management functions
function getAllBooks() {
    return fetch('/library-system/api/book.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.books;
            } else {
                throw new Error(data.message);
            }
        });
}

function addBook(title, author) {
    return fetch('/library-system/api/book.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'add',
            title: title,
            author: author
        }),
    })
    .then(response => response.json());
}

function editBook(id, title, author) {
    return fetch('../api/book.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'edit',
            id: id,
            title: title,
            author: author
        }),
    })
    .then(response => response.json());
}

function deleteBook(id) {
    return fetch('/library-system/api/book.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'delete',
            id: id
        }),
    })
    .then(response => response.json());
}

function updateBookStatus(id, status) {
    return fetch('/library-system/api/book.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'updateStatus',
            id: id,
            status: status
        }),
    })
    .then(response => response.json());
}
// do not kuti ieties
document.addEventListener('DOMContentLoaded', () => {
    const availableBooks = document.getElementById('availableBooks');
    const borrowedBooks = document.getElementById('borrowedBooks');

    function loadBooks() {
        getAllBooks()
            .then(books => {
                availableBooks.innerHTML = '';
                borrowedBooks.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>
                            ${book.status === 'Available' 
                                ? `<button class="btn btn-sm btn-primary borrow-book" data-id="${book.id}">Borrow</button>`
                                : `<button class="btn btn-sm btn-success return-book" data-id="${book.id}">Return</button>`
                            }
                        </td>
                    `;
                    if (book.status === 'Available') {
                        availableBooks.appendChild(row);
                    } else {
                        borrowedBooks.appendChild(row);
                    }
                });
            })
            .catch(error => console.error('Error loading books:', error));
    }

    loadBooks();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('borrow-book')) {
            const bookId = e.target.getAttribute('data-id');
            // Show confirmation dialog
            const confirmBorrow = confirm('Are you sure you want to borrow this book?');
            if (confirmBorrow) {
                updateBookStatus(bookId, 'Borrowed')
                    .then(result => {
                        if (result.success) {
                            loadBooks();
                            alert('Book borrowed successfully.');
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error borrowing book:', error);
                        alert('An unexpected error occurred.');
                    });
            }
        } else if (e.target.classList.contains('return-book')) {
            const bookId = e.target.getAttribute('data-id');
            // Show confirmation dialog
            const confirmReturn = confirm('Are you sure you want to return this book?');
            if (confirmReturn) {
                updateBookStatus(bookId, 'Available')
                    .then(result => {
                        if (result.success) {
                            loadBooks();
                            alert('Book returned successfully.');
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error returning book:', error);
                        alert('An unexpected error occurred.');
                    });
            }
        }
    });
 });
//Search and display 
document.addEventListener('DOMContentLoaded', () => {
    const availableBooks = document.getElementById('availableBooks');
    const borrowedBooks = document.getElementById('borrowedBooks');
    const searchAvailable = document.getElementById('searchAvailable');
    const searchBorrowed = document.getElementById('searchBorrowed');

    function loadBooks() {
        getAllBooks()
            .then(books => {
                availableBooks.innerHTML = '';
                borrowedBooks.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>
                            ${book.status === 'Available' 
                                ? `<button class="btn btn-sm btn-primary borrow-book" data-id="${book.id}">Borrow</button>`
                                : `<button class="btn btn-sm btn-success return-book" data-id="${book.id}">Return</button>`
                            }
                        </td>
                    `;
                    if (book.status === 'Available') {
                        availableBooks.appendChild(row);
                    } else {
                        borrowedBooks.appendChild(row);
                    }
                });
            })
            .catch(error => console.error('Error loading books:', error));
    }

    function filterBooks() {
        const availableSearchTerm = searchAvailable.value.toLowerCase();
        const borrowedSearchTerm = searchBorrowed.value.toLowerCase();

        const availableRows = availableBooks.getElementsByTagName('tr');
        const borrowedRows = borrowedBooks.getElementsByTagName('tr');

        // Filter available books
        Array.from(availableRows).forEach(row => {
            const title = row.cells[1].textContent.toLowerCase();
            const author = row.cells[2].textContent.toLowerCase();
            if (title.includes(availableSearchTerm) || author.includes(availableSearchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        // Filter borrowed books
        Array.from(borrowedRows).forEach(row => {
            const title = row.cells[1].textContent.toLowerCase();
            const author = row.cells[2].textContent.toLowerCase();
            if (title.includes(borrowedSearchTerm) || author.includes(borrowedSearchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    loadBooks();

    // Add event listeners for search inputs
    searchAvailable.addEventListener('input', filterBooks);
    searchBorrowed.addEventListener('input', filterBooks);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('borrow-book')) {
            const bookId = e.target.getAttribute('data-id');
            updateBookStatus(bookId, 'Borrowed')
            .then(() => {
                loadBooks(); // Reload the book lists after updating the status
            })
            .catch(error => console.error('Error borrowing book:', error));
        } else if (e.target.classList.contains('return-book')) {
            const bookId = e.target.getAttribute('data-id');
            updateBookStatus(bookId, 'Available')
            .then(() => {
                loadBooks(); // Reload the book lists after updating the status
            })
            .catch(error => console.error('Error returning book:', error));
        }
    });
});




////////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', () => {
    const bookTableBody = document.getElementById('bookTableBody');
    const addBookBtn = document.getElementById('addBookBtn');
    const updateBookBtn = document.getElementById('updateBookBtn');

    function loadBooks() {
        getAllBooks()
            .then(books => {
                bookTableBody.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-book" data-id="${book.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-book" data-id="${book.id}">Delete</button>
                        </td>
                    `;
                    bookTableBody.appendChild(row);
                });
            })

    }

    loadBooks();

    addBookBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        addBook(title, author)
            .then(result => {
                if (result.success) {
                    loadBooks();
                    document.getElementById('addBookForm').reset();
                    bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
                    showModal('Success', 'Book added successfully');
                } else {
                    showModal('Error', result.message);
                }
            })
            .catch(error => {
                console.error('Error adding book:', error);
                showModal('Error', 'An unexpected error occurred');
            });
    });

    updateBookBtn.addEventListener('click', () => {
        const id = document.getElementById('editBookId').value;
        const title = document.getElementById('editTitle').value;
        const author = document.getElementById('editAuthor').value;

        editBook(id, title, author)
            .then(result => {
                if (result.success) {
                    loadBooks();
                    bootstrap.Modal.getInstance(document.getElementById('editBookModal')).hide();
                    showModal('Success', 'Book updated successfully');
                } else {
                    showModal('Error', result.message);
                }
            })
            .catch(error => {
                console.error('Error updating book:', error);
                showModal('Error', 'An unexpected error occurred');
            });
    });



//delete book with confirmation if available and borrowed


bookTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-book')) {
        const bookId = e.target.getAttribute('data-id');
        const bookRow = e.target.closest('tr'); // Get the row containing the book details
        const bookStatus = bookRow.querySelector('td:nth-child(4)').textContent.trim(); // Extract the status column

        if (bookStatus === 'Borrowed') {
            // Show an alert if the book is borrowed
            alert('You cannot delete borrowed books.');
        } else if (bookStatus === 'Available') {
            // Allow the user to confirm deletion if the book is available
            if (confirm('Are you sure you want to delete this book?')) {
                deleteBook(bookId)
                    .then(result => {
                        if (result.success) {
                            loadBooks(); // Reload the books list
                            showModal('Success', 'Book deleted successfully.');
                        } else {
                            showModal('Error', result.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        showModal('Error', 'An unexpected error occurred.');
                    });
            }
        }
    }
});

});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('borrow-book')) {
        const bookId = e.target.getAttribute('data-id');
        // Show confirmation dialog
        const confirmBorrow = confirm('Are you sure you want to borrow this book?');
        if (confirmBorrow) {
            updateBookStatus(bookId, 'Borrowed')
                .then(result => {
                    if (result.success) {
                        // Log the borrowing action in the database
                        logBorrowingAction(bookId, 'borrow')
                            .then(logResult => {
                                if (logResult.success) {
                                    loadBooks();
                                    alert('Book borrowed successfully.');
                                } else {
                                    alert(`Error logging borrowing action: ${logResult.message}`);
                                }
                            });
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error borrowing book:', error);
                    alert('An unexpected error occurred.');
                });
        }
    }
});

// Function to log the borrowing action
function logBorrowingAction(bookId, action) {
    return fetch('/library-system/api/log_borrowing.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book_id: bookId,
            action: action
        }),
    })
    .then(response => response.json());
}