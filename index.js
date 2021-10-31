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

      

      //Destinations
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

      
      //Bookings
      const bookingCollections = database.collection("bookings");
      app.get('/bookings', async(req, res)=> {
        const cursor = bookingCollections.find({});
        const bookings = await cursor.toArray();
        res.json(bookings);
      });
      app.post('/bookings', async(req, res)=>{
        const booking = req.body;
        
        booking.status = 0;
        const result = await bookingCollections.insertOne(booking);
        res.json(result);
      });
      app.get('/my-bookings/:email', async(req, res)=>{
        const email = req.params.email;
        const query = { email: email};
        const cursor = bookingCollections.find(query);
        const bookings = await cursor.toArray();
        res.json(bookings);
      });

      app.delete('/bookings/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await bookingCollections.deleteOne(query);
          res.json(result);
      });

      app.put('/bookings/:id', async(req, res)=>{
        const query = { _id: ObjectId(req.params.id) };
        const updateDoc = {
            $set: {
              status: 1
            },
          };
          const options = { upsert: true };

          const result = await bookingCollections.updateOne(query, updateDoc, options);
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