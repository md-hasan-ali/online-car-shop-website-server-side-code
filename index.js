const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Middle Ware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("car_shop");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");
        const orderReview = database.collection("review");

        // get service 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result)
        })

        // get single service
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.find(query).toArray();
            res.send(result[0])
        })
        // Post method for orders
        app.post('/orders', async (req, res) => {
            const query = req.body;
            const result = await orderCollection.insertOne(query)
            res.json(result)
        })
        // Get Orders 
        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.json(result)
        })
        // POST Order Review
        app.post('/review', async (req, res) => {
            const query = req.body;
            const result = await orderReview.insertOne(query)
            res.json(result)
        })
        // Get review
        app.get('/review', async (req, res) => {
            const result = await orderReview.find({}).toArray();
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello Car shop..')
})
app.listen(port, () => {
    console.log('listening the port', port)
})