<?php
function authenticateUser($username, $password) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }

    return false;
}

// function isAuthenticated() {
//     return isset($_SESSION['user_id']);
// }

function isAdmin() {
    
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function isLibrarian() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'librarian';
}