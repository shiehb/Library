<?php
session_start();
require_once '../config/database.php'; // Include your database connection file
require_once '../includes/auth.php'; // Include your authentication functions

// Check if the user is already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: " . ($_SESSION['role'] === 'admin' ? "/library-system/views/admin/dashboard.php" : "/library-system/views/librarian/borrow_return.php"));
    exit;
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare and execute the SQL statement to fetch user data
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists and verify the password
    if ($user && password_verify($password, $user['password'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // Redirect based on user role
        header("Location: " . ($user['role'] === 'admin' ? "/library-system/views/admin/dashboard.php" : "/library-system/views/librarian/borrow_return.php"));
        exit;
    } else {
        $error = "Invalid username or password";
    }
}


// session_start();

// // Check if the user is already logged in
// if (isset($_SESSION['user_id'])) {
//     header("Location: " . ($_SESSION['role'] === 'admin' ? "/library-system/views/admin/dashboard.php" : "/library-system/views/librarian/borrow_return.php"));
//     exit;
// }

// // Handle login form submission
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $username = $_POST['username'];
//     $password = $_POST['password'];

//     // Check for admin credentials
//     if ($username === 'admin' && $password === 'password123') {
//         $_SESSION['user_id'] = 1;
//         $_SESSION['username'] = 'admin';
//         $_SESSION['role'] = 'admin';
//         header("Location: /library-system/views/admin/dashboard.php");
//         exit;
//     }
//     // Check for librarian credentials
//     elseif ($username === 'librarian' && $password === 'librarian123') {
//         $_SESSION['user_id'] = 2; // Assuming 2 is the ID for the librarian
//         $_SESSION['username'] = 'librarian';
//         $_SESSION['role'] = 'librarian';
//         header("Location: /library-system/views/librarian/borrow_return.php");
//         exit;
//     } else {
//         $error = "Invalid username or password";
//     }
// }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Library Management System</title>
    <link rel="stylesheet" href="/library-system/assets/css/styles.css">
</head>
<body>
<div class="bg-image">
    <div class="container">
            <h1 class="text-center">Library Management System</h1> 
        <div class="login-container">
        <form method="post" class="login-form">
    <h2>Login</h2>
    <?php if (isset($error)): ?>
        <div class="alert alert-error"><?php echo $error; ?></div>
    <?php endif; ?>
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required>
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required>
    </div>
    <button type="submit">Login</button>
</form>
        </div>
    </div>
    </div>
</body>
</html>
<?php require_once '../includes/footer.php'; ?>