<?php
require_once '../../includes/header.php';
if (!isAdmin()) {
    header('Location: /library-system?index.php');
    exit;
}
?>

<h1 class="mb-4 ">Reports</h1>

<div class="mb-3">
    <label for="statusFilter" class="form-label">Filter by Status:</label>
    <select class="form-select" id="statusFilter">
        <option value="">All</option>
        <option value="Available">Available</option>
        <option value="Borrowed">Borrowed</option>
    </select>
</div>

<button class="btn btn-primary mb-3" id="generateReport">Generate PDF Report</button>

<table class="table table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody id="bookTableBody">
    </tbody>
</table>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/library-system/assets/js/report.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const statusFilter = document.getElementById('statusFilter');
    const generateReportBtn = document.getElementById('generateReport');
    const bookTableBody = document.getElementById('bookTableBody');

    function loadBooks(status = '') {
        getBooksByStatus(status)
            .then(books => {
                bookTableBody.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.status}</td>
                    `;
                    bookTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading books:', error));
    }

    loadBooks();

    statusFilter.addEventListener('change', () => {
        loadBooks(statusFilter.value);
    });

    generateReportBtn.addEventListener('click', () => {
        getBooksByStatus(statusFilter.value)
            .then(books => generatePDF(books))
            .catch(error => console.error('Error generating report:', error));
    });
});
</script>

<?php require_once '../../includes/footer.php'; ?>