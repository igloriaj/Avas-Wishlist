import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 }); //Confirm successful connection
  console.log("Connected to MongoDB successfully!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
};

let db = client.db("avas_wishlist");

export default db;