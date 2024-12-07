<?php
session_start();
require_once '../config/database.php';
require_once '../includes/auth.php';

header('Content-Type: application/json');

if (!isAdmin()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all users
    $users = getAllUsers();

    echo json_encode(['success' => true, 'users' => $users]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'add':
                $result = addUser($data['username'], $data['password'], $data['role']);
                echo json_encode($result);
                break;
            case 'edit':
                $result = editUser($data['id'], $data['username'], $data['password'], $data['role']);
                echo json_encode($result);
                break;
            case 'delete':
                $result = deleteUser($data['id']);
                echo json_encode($result);
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing action']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
//Display user information
function getAllUsers() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users");
    $stmt->execute();
    $users  = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
    exit;

} 

function addUser($username, $password, $role) {
    global $pdo;
    
    if (userExists($username)) {
        return ['success' => false, 'message' => 'Username already exists'];
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $result = $stmt->execute([$username, $hashedPassword, $role]);
    
    return ['success' => $result, 'message' => $result ? 'User added successfully' : 'Failed to add user'];
}

function editUser($id, $username, $password, $role) {
    global $pdo;
    
    if ($password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?");
        $result = $stmt->execute([$username, $hashedPassword, $role, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
        $result = $stmt->execute([$username, $role, $id]);
    }
    return ['success' => $result, 'message' => $result ? 'User updated successfully' : 'Failed to update user'];
}

function deleteUser($id) {
    global $pdo;
    
    if ($id == $_SESSION['user_id']) {
        return ['success' => false, 'message' => 'Cannot delete your own account'];
    }
    
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $result = $stmt->execute([$id]);
    
    return ['success' => $result, 'message' => $result ? 'User deleted successfully' : 'Failed to delete user'];
}

function userExists($username) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    return $stmt->fetch() !== false;
}
