<?php
session_start();
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/auth.php';

// Uncomment the authentication check for security
// if (!isAuthenticated()) {
//     header('Location: /library-system/views/login.php');
//     exit;
// }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/library-system/assets/css/style.css" rel="stylesheet">
</head>
<body>
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Library Management</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <?php if (isAdmin()): ?>
                            <li class="nav-item"><a class="nav-link" href="../../views/admin/dashboard.php">Dashboard</a></li>
                            <li class="nav-item"><a class="nav-link" href="../../views/admin/manage_users.php">Manage Users</a></li>
                            <li class="nav-item"><a class="nav-link" href="../../views/admin/manage_books.php">Manage Books</a></li>
                            <li class="nav-item"><a class="nav-link" href="../../views/admin/reports.php">Reports</a></li>
                        <?php elseif (isLibrarian()): ?>
                            <li class="nav-item"><a class="nav-link" href="../../views/librarian/borrow_return.php">Borrow/Return</a></li>
                        <?php endif; ?>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="../../logout.php">Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="container mt-4 contents">