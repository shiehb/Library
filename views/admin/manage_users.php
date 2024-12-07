<?php
require_once '../../includes/header.php';
if (!isAdmin()) {
    header('Location: /library-system/index.php');
    exit;
}
?>
<div class="bg-image">
    <h1>Manage Users</h1>
    <form id="add-user-form">
        <h2>Add New User</h2>
        <input type="text" id="username" name="username" placeholder="Username" required>
        <input type="password" id="password" name="password" placeholder="Password" required>
        <select id="role" name="role" required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
        </select>
        <button type="submit">Add User</button>
    </form>
    <div id="user-list">
        <h2>User List</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="users">
                <!-- User rows will be populated here -->
            </tbody>
        </table>
    </div>
</div>
<script src="../../assets/js/user.js"></script>
<?php require_once '../../includes/footer.php'; ?>