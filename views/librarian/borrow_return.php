<?php
require_once '../../includes/header.php';
if (!isLibrarian()) {
    header('Location: /library-system/views/login.php');
    exit;
}
?>
<div class="bg-image">
    <h1 class="mb-4">Borrow / Return Books</h1>
    <div class="row">
        <div class="col-md-6">
            <h2>Available Books</h2>
            <input type="text" id="searchAvailable" placeholder="Search available books..." class="form-control mb-3">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>// Interface for generating reports// Interface for generating reports
                        <th>Title</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="availableBooks">
                </tbody>
            </table>
        </div>
        <div class="col-md-6">
            <h2>Borrowed Books</h2>
            <input type="text" id="searchBorrowed" placeholder="Search borrowed books..." class="form-control mb-3">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="borrowedBooks">
                </tbody>
            </table>
        </div>
    </div>
</div>
<script src="../../assets/js/book.js"></script>
<?php require_once '../../includes/footer.php'; ?>

