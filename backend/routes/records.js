import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

//get records
router.get('/', async (req, res) => {
  let collection = db.collection('records');
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

//get a single record by id
router.get('/:id', async (req, res) => {
  let collection = db.collection('records');
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!restult) res.send("Not found").status(404);
  else res.send(result).status(200);
});

//Create a new record
router.post('/', async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      link: req.body.link,
      claimed: false,
      claimedBy: null
    };
    let collection = await db.collection('records');
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (error) {
    res.send("Error creating record").status(500);
  }
  });

 //update a record by id
 router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const update = {
      name: req.body.name,
      link: req.body.link,
      claimed: req.body.claimed,
      claimedBy: req.body.claimedBy
    };
    let collection = await db.collection('records');
    let result = await collection.updateOne(query, update);
    res.send(result).status(200);
  } catch (error) {
    res.send("Error updating record").status(500);
  }
});

//delete a record by id
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection('records');

    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (error) {
    res.send("Error deleting record").status(500);
  }
});

export default router;