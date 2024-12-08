// const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

const username = process.env.USER;
const password = process.env.PASS;

/*
mongodb
*/
const uri = `mongodb+srv://${username}:${password}@cluster0.pzdjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const visaCollection = client.db('visaDB').collection('allVisa');

    app.get('/allVisa', async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/allVisa/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
    });

    app.post('/allVisa', async (req, res) => {
      const newVisa = req.body;
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    });

    app.put('/allVisa/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedVisa = { $set: req.body };
      const result = await visaCollection.updateOne(
        filter,
        updatedVisa,
        options,
      );
      res.send(result);
    });

    app.delete('/allVisa/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });

    /*
applications
    */

    const applicationCollection = client
      .db('visaDB')
      .collection('visaApplications');

    app.get('/visaApplications', async (req, res) => {
      const cursor = applicationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/visaApplications', async (req, res) => {
      const newVisa = req.body;
      const result = await applicationCollection.insertOne(newVisa);
      res.send(result);
    });

    app.delete('/visaApplications/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationCollection.deleteOne(query);
      res.send(result);
    });

/*
 app.delete('/allVisa/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });
*/
    

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

/*
mongodb
*/

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
