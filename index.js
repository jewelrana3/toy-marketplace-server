const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnbwwnw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const newCollection = client.db('newChild').collection('child')
    const bookingData = client.db('newChild').collection('bookings')

    app.get('/child',async(req,res)=>{
      const cursor = newCollection.find()
      const result = await cursor.toArray()
      res.send(result);
    })
    app.get('/child/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {  title: 1, price: 1,photo_url:1,service_id:1 },
      };
      const result = await newCollection.findOne(query,options)
      res.send(result)
    
    });

    // altoys data
    app.get('/alltoys',async(req,res)=>{
      console.log(req.query.email)
      let query = {};
      if(req.query?.email){
        query = {email:req.query.email}
      }
      const result = await bookingData.find(query).toArray()
      res.send(result)
    });

    app.get('/alltoys',async(req,res)=>{
      console.log(req.query.email)
      const query = {_id: new ObjectId(id)}
      const result = await bookingData.findOne(query)
      res.send(result)
    })

    app.post('/alltoys',async(req,res)=>{
      const body = req.body;
      console.log(body);
      const result = await bookingData.insertOne(body)
      res.send(result)

    });

    app.delete('/alltoys/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await bookingData.deleteOne(query);
      res.send(result);
    });

    app.patch('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
      console.log(updated);
      const updateDoc = {
          $set: {
              status: updated.status
          },
      };
      const result = await bookingData.updateOne(filter,updateDoc)
      res.send(result)
     
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('server is ruuning')
});

app.listen(port,()=>{
    console.log(`server side is start,${port}`)
})