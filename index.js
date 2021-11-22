// Require Necessary File 
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

// Connect to Database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// run function create 
async function run() {
    try {
        await client.connect();
        const database = client.db("car_shop");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");
        const orderReview = database.collection("review");
        const userCollection = database.collection("users");

        // get service 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result)
        })
        // DELETE a product 
        app.delete('/manage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
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
        // Get my Orders 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();
            res.json(result)
        })
        //Get All Orders for Manage
        app.get('/manageOrders', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.json(result)
        })
        // Delete Single Order
        app.delete('/singleOrder/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            console.log(result)
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
        // Delete single data of my order
        app.delete('/orders', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            console.log(result)
            res.json(result)
        })
        // Add A New Product to ProductCollection
        app.post('/addNewProduct', async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
            res.json(result)
        })
        // Post user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            console.log(result)
            res.json(result)
        })
        // Set Admin Role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
        // Make Admin 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })
        // Status Update 
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const update = 'Approved';
            const result = await orderCollection.updateOne(filter, {
                $set: { status: update }
            })
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