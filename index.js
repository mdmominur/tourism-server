const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId =  require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000; 

//middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Server is running...');
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mpvkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      console.log('Database Connected');
      const database = client.db("tourism");

      const destinationCollections = database.collection("destinations");
      app.get('/destinations', async(req, res)=> {
        const cursor = destinationCollections.find({});
        const destinations = await cursor.toArray();
        res.json(destinations);
      });
      app.get('/destinations/:id', async(req, res)=> {
         
          const query = { _id: ObjectId(req.params.id) };
          const destination = await destinationCollections.findOne(query);
          res.json(destination)
        
      });

      app.post('/destinations', async(req, res)=>{
        const destination = req.body;
          const result = await destinationCollections.insertOne(destination);

          res.json(result);
      });
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.listen(port, ()=>{
    console.log('Server is running on port: ', port);
})