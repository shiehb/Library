<?php
session_start();
require_once '../config/database.php';
require_once '../includes/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all books
    $books = getAllBooks();
    echo json_encode(['success' => true, 'books' => $books]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'add':
                if (!isAdmin()) {
                    echo json_encode(['success' => false, 'message' => 'Unauthorized action']);
                    exit;
                }
                $result = addBook($data['title'], $data['author']);
                echo json_encode($result);
                break;
            case 'edit':
                if (!isAdmin()) {
                    echo json_encode(['success' => false, 'message' => 'Unauthorized action']);
                    exit;
                }
                $result = editBook($data['id'], $data['title'], $data['author']);
                echo json_encode($result);
                break;
            case 'delete':
                if (!isAdmin()) {
                    echo json_encode(['success' => false, 'message' => 'Unauthorized action']);
                    exit;
                }
                $result = deleteBook($data['id']);
                echo json_encode($result);
                break;
            case 'updateStatus':
                $result = updateBookStatus($data['id'], $data['status']);
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

function getAllBooks() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM books");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function addBook($title, $author) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO books (title, author, status) VALUES (?, ?, 'Available')");
    $result = $stmt->execute([$title, $author]);
    
    return ['success' => $result, 'message' => $result ? 'Book added successfully' : 'Failed to add book'];
}

function editBook($id, $title, $author) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ? WHERE id = ?");
    $result = $stmt->execute([$title, $author, $id]);
    
    return ['success' => $result, 'message' => $result ? 'Book updated successfully' : 'Failed to update book'];
}

function deleteBook($id) {
    global $pdo;
    
    // Check if the book is currently borrowed
    $stmt = $pdo->prepare("SELECT status FROM books WHERE id = ?");
    $stmt->execute([$id]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($book['status'] === 'Borrowed') {
        return ['success' => false, 'message' => 'Cannot delete a borrowed book'];
    }
    
    $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
    $result = $stmt->execute([$id]);
    
    return ['success' => $result, 'message' => $result ? 'Book deleted successfully' : 'Failed to delete book'];
}

function updateBookStatus($id, $status) {
    global $pdo;
    
    // Check if the status change is valid
    $stmt = $pdo->prepare("SELECT status FROM books WHERE id = ?");
    $stmt->execute([$id]);
    $currentStatus = $stmt->fetchColumn();
    
    if (($currentStatus === 'Available' && $status === 'Borrowed') ||
        ($currentStatus === 'Borrowed' && $status === 'Available')) {
        $stmt = $pdo->prepare("UPDATE books SET status = ? WHERE id = ?");
        $result = $stmt->execute([$status, $id]);
        
        return ['success' => $result, 'message' => $result ? 'Book status updated successfully' : 'Failed to update book status'];
    } else {
        return ['success' => false, 'message' => 'Invalid status change'];
    }
}