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

        // get service 
        app.get('/products', async (req, res) => {
            const result = await productCollection.find({}).toArray();
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