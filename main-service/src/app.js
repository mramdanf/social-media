const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');

const file = fs.readFileSync(
  path.join(process.cwd(), 'src', 'swagger.yaml'),
  'utf8'
);
const swaggerDocument = YAML.parse(file);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Social Media App Service'
  })
);

const port = process.env.MAIN_SERVICE_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
