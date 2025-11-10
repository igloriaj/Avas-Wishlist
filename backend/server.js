import express from 'express';
import cors from 'cors';
import records from './routes/records.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/records', records);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});

