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
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $books = getBooksByStatus($status);
    echo json_encode(['success' => true, 'books' => $books]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

function getBooksByStatus($status = null) {
    global $pdo;
    
    if ($status) {
        $stmt = $pdo->prepare("SELECT id, title, author, status FROM books WHERE status = ?");
        $stmt->execute([$status]);
    } else {
        $stmt = $pdo->prepare("SELECT id, title, author, status FROM books");
        $stmt->execute();
    }
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}