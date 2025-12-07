require("dotenv").config();
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const db = require("./db");

const app = express();
app.use(express.json());

// --- Backup helper ---
async function createBackup() {
    const data = await db.getRecords("users");
    await fs.mkdir("./backups", { recursive: true });

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const file = `backups/backup_${ts}.json`;

    await fs.writeFile(file, JSON.stringify(data, null, 2));
    console.log("Backup created:", file);
}

// --- Routes ---

// 1) GET all users
app.get("/users", async (req, res) => {
    const users = await db.getRecords("users");
    res.json(users);
});

// 2) ADD user (+ automatic BACKUP)
app.post("/users", async (req, res) => {
    await db.addRecord("users", req.body);
    await createBackup();
    res.json({ message: "User added", user: req.body });
});

// 3) DELETE user (+ automatic BACKUP)
app.delete("/users", async (req, res) => {
    await db.deleteRecord("users", req.body); // e.g. {email:"x@gmail.com"}
    await createBackup();
    res.json({ message: "User deleted" });
});

// 4) SEARCH (name, email, role)
app.get("/search", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Query ?q= missing" });

    const users = await db.getRecords("users");
    const results = users.filter(u =>
        u.name?.toLowerCase().includes(q.toLowerCase()) ||
        u.email?.toLowerCase().includes(q.toLowerCase()) ||
        u.role?.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ count: results.length, results });
});

// 5) SORT (name, email, role)
app.get("/sort", async (req, res) => {
    const field = req.query.field || "name";  // default sort by name
    const order = req.query.order === "desc" ? -1 : 1;

    const users = await db.getRecords("users");
    users.sort((a, b) => {
        if (!a[field] || !b[field]) return 0;
        return a[field].localeCompare(b[field]) * order;
    });

    res.json(users);
});

// 6) EXPORT to TXT
app.get("/export", async (req, res) => {
    const users = await db.getRecords("users");

    let text = `Export Date: ${new Date().toISOString()}
Total Records: ${users.length}

`;

    users.forEach((u, i) => {
        text += `${i + 1}. Name: ${u.name} | Email: ${u.email} | Role: ${u.role}\n`;
    });

    await fs.writeFile("./export.txt", text);
    res.json({ message: "Exported to export.txt" });
});

// 7) STATISTICS
app.get("/stats", async (req, res) => {
    const users = await db.getRecords("users");
    if (!users.length) return res.json({ message: "No users found" });

    const total = users.length;

    const longestName = users.reduce((a, u) =>
        u.name?.length > (a?.name?.length || 0) ? u : a
    );

    const earliest = users[0];
    const latest = users[users.length - 1];

    res.json({
        total,
        longestName: longestName.name,
        earliestUser: earliest.name,
        latestUser: latest.name
    });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running at port " + PORT));
