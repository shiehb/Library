// User management functions
function getAllUsers() {
    return fetch('../../api/user.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.users;
            } else {
                throw new Error(data.message);
            }
        });
}

function addUser(username, password, role) {
    return fetch('../../api/user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'add',
            username: username,
            password: password,
            role: role
        }),
    })
    .then(response => response.json());
}

// Function to edit a user
function editUser (id, username, password, role) {
    return fetch('../../api/user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'edit',
            id: id,
            username: username,
            password: password,
            role: role
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User  updated successfully!');
            return data;
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user.');
    });
}

// Function to delete a user
function deleteUser (id) {
    return fetch('../../api/user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'delete',
            id: id
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User  deleted successfully!');
            return data;
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
    });
}

////////////////////////////////////////////////////////////////
window.onload = () => fetchUser ();

// Handle the form submission
document.getElementById('add-user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    fetch('../../api/user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User  added successfully!');
                fetchUser (); // Refresh the user list
                document.getElementById('add-user-form').reset(); // Reset the form
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the user.');
        });
});

async function getUsers() {
    try {
        const response = await fetch('../../api/user.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function fetchUser () {
    const users = await getUsers();

    const userList = document.getElementById('users');
    // Clear the current list
    userList.innerHTML = "";

    users.forEach((user) => {
        const userHTML = `
            <tr class="user-row" id="${user.id}">
                <td class="user-id">${user.id}</td>
                <td class="user-id">${user.username}</td>
                <td class="user-role">${user.role}</td>
                <td class="user-actions">
                    <button class="edit-btn" onclick="editUser (${user.user_id})">Edit</button>
                    <button class="delete-btn" onclick="User (${user.user_id})">Delete</button>
                </td>
            </tr>
        `;
        userList.innerHTML += userHTML;
    });
}