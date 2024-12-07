```php
<?php
require_once '../../includes/header.php';
if (!isAdmin()) {
    header('Location: /library-system/index.php');
    exit;
}
?>
<div class="bg-image">
    <h1 class="mb-4">Admin Dashboard</h1>
    <div class="row">
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Total Users</h5>
                    <p class="card-text" id="totalUsers">Loading...</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Total Books</h5>
                    <p class="card-text" id="totalBooks">Loading...</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Borrowed Books</h5>
                    <p class="card-text" id="borrowedBooks">Loading...</p>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Fetch user count
            const response = await fetch('../../api/user.php');
            const userData = await response.json();
            if (userData.success) {
                document.getElementById('totalUsers').textContent = userData.users.length;
            } else {
                document.getElementById('totalUsers').textContent = 'Error loading data';
            }
        } catch (error) {
            document.getElementById('totalUsers').textContent = 'Error loading data';
        }

        try {
            // Fetch book count and borrowed books count
            const response = await fetch('../../api/book.php');
            const bookData = await response.json();
            if (bookData.success) {
                document.getElementById('totalBooks').textContent = bookData.books.length;
                const borrowedCount = bookData.books.filter(book => book.status === 'Borrowed').length;
                document.getElementById('borrowedBooks').textContent = borrowedCount;
            } else {
                console.error('Error fetching book data:', bookData.message);
            }
        } catch (error) {
            console.error('Error fetching book data:', error);
        }
    }); 
</script>
<?php require_once '../../includes/footer.php'; ?>