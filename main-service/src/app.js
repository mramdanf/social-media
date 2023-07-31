const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const userRouter = require('./routes/userRoutes');

const file = fs.readFileSync(
  path.join(process.cwd(), 'src', 'swagger.yaml'),
  'utf8'
);
const swaggerDocument = YAML.parse(file);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
