require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');   // Import MongoDB service
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());  // To parse JSON request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Example route to add a todo
app.post('/todo', async (req, res) => {
    try {
        const result = await db.addTodo(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Example route to get a todo by ID
app.get('/todo/:id', async (req, res) => {
    try {
        const todo = await db.getTodoById(req.params.id);
        if (!todo) return res.status(404).json({ error: "Not Found" });
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
});

