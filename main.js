// main.js
require('dotenv').config(); // Load environment variables first
const db = require('./db'); // Import your MongoDB service

// Example: Add a new user
async function addNewUser(user) {
    try {
        await db.addRecord('users', user);
        console.log('User added successfully:', user);
    } catch (err) {
        console.error('Error adding user:', err);
    }
}

// Example: Fetch all users
async function fetchAllUsers() {
    try {
        const users = await db.getRecords('users');
        console.log('All users:', users);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

// Example: Fetch a single user by query
async function fetchUserByQuery(query) {
    try {
        const user = await db.getRecord('users', query);
        console.log('User found:', user);
    } catch (err) {
        console.error('Error fetching user:', err);
    }
}

// Example: Update a user by query
async function updateUser(query, updateData) {
    try {
        await db.updateRecord('users', query, updateData);
        console.log('User updated successfully');
    } catch (err) {
        console.error('Error updating user:', err);
    }
}

// Example: Delete a user by query
async function deleteUser(query) {
    try {
        await db.deleteRecord('users', query);
        console.log('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
    }
}

// Example usage
(async () => {
    // Add a user
    await addNewUser({ name: 'Hamza', email: 'hamza@example.com', role: 'admin' });

    // Fetch all users
    await fetchAllUsers();

    // Fetch a user by email
    await fetchUserByQuery({ email: 'hamza@example.com' });

    // Update user's role
    await updateUser({ email: 'hamza@example.com' }, { role: 'superadmin' });

    // Delete user
    // await deleteUser({ email: 'hamza@example.com' });
})();
