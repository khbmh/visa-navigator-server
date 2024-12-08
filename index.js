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

// MongoDB connection URL
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
    const applicationCollection = client
      .db('visaDB')
      .collection('visaApplications');

    // GET all visas
    app.get('/allVisa', async (req, res) => {
      try {
        const cursor = visaCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching visas:', error);
        res
          .status(500)
          .send({ error: 'An error occurred while fetching visas.' });
      }
    });

    // GET a single visa by ID
    app.get('/allVisa/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await visaCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error('Error fetching visa by ID:', error);
        res
          .status(500)
          .send({ error: 'An error occurred while fetching the visa.' });
      }
    });

    // POST a new visa
    app.post('/allVisa', async (req, res) => {
      try {
        const newVisa = req.body;
        const result = await visaCollection.insertOne(newVisa);
        res.send(result);
      } catch (error) {
        console.error('Error inserting visa:', error);
        res
          .status(500)
          .send({ error: 'An error occurred while inserting the visa.' });
      }
    });

    // PUT (update) a visa by ID
    app.put('/allVisa/:id', async (req, res) => {
      try {
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
      } catch (error) {
        console.error('Error updating visa:', error);
        res
          .status(500)
          .send({ error: 'An error occurred while updating the visa.' });
      }
    });

    // DELETE a visa by ID
    app.delete('/allVisa/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await visaCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error('Error deleting visa:', error);
        res
          .status(500)
          .send({ error: 'An error occurred while deleting the visa.' });
      }
    });

    // GET all visa applications
    app.get('/visaApplications', async (req, res) => {
      try {
        const cursor = applicationCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching visa applications:', error);
        res
          .status(500)
          .send({
            error: 'An error occurred while fetching visa applications.',
          });
      }
    });

    // POST a new visa application
    app.post('/visaApplications', async (req, res) => {
      try {
        const newVisa = req.body;
        const result = await applicationCollection.insertOne(newVisa);
        res.send(result);
      } catch (error) {
        console.error('Error inserting visa application:', error);
        res
          .status(500)
          .send({
            error: 'An error occurred while inserting the visa application.',
          });
      }
    });

    // DELETE a visa application by ID
    app.delete('/visaApplications/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await applicationCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error('Error deleting visa application:', error);
        res
          .status(500)
          .send({
            error: 'An error occurred while deleting the visa application.',
          });
      }
    });

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

app.get('/', (req, res) => {
  res.send('hello world');
});

// Vercel automatically assigns a port, so you don't need to specify a port in your code
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
