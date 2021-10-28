const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middle-ware
app.use(cors());
app.use(express.json());

//password: QfJepgOXfPwop1vT
//user: geniusdb

// -------------mongodb---setup------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odmwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic')
        const servicesCollection = database.collection('services')


        //GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get Single Service
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            console.log('getting specific id', id)
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

         // POST API
         app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            
            res.json(result)
        })

        //DELETE API
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    }

    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('genius car crud server')
})

app.listen(port, () => {
    console.log('genius car running on server', port)
})