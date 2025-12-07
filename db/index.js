const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI); // no options
let db;

async function connect() {
    if (!db) {
        await client.connect();
        db = client.db('SCDProject25'); // replace with your DB name
        console.log('MongoDB Connected Successfully');
    }
    return db;
}

async function addRecord(collectionName, record) {
    const database = await connect();
    const collection = database.collection(collectionName);
    return collection.insertOne(record);
}

async function getRecords(collectionName) {
    const database = await connect();
    const collection = database.collection(collectionName);
    return collection.find({}).toArray();
}

async function deleteRecord(collectionName, query) {
    const database = await connect();
    const collection = database.collection(collectionName);
    return collection.deleteOne(query);
}

module.exports = { connect, addRecord, getRecords, deleteRecord };

