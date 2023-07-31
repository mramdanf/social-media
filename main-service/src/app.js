const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const userRouter = require('./routes/userRoutes');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);

// configure mongoose
const mongodbPort = process.env.MONGO_DB_PORT || 27017;
async function connectMongoDB() {
  await mongoose.connect(
    `mongodb://admin:password@localhost:${mongodbPort}/social_media?tls=false&authSource=admin`
  );
  console.log('connected to mongodb');
}
connectMongoDB().catch((err) => console.log(err));

const port = process.env.MAIN_SERVICE_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
