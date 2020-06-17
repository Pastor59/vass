import express from 'express';
import helmet from 'helmet';
import http from 'http';
import environmentParams from 'dotenv';
import config from 'config';

const env = environmentParams.config().parsed.ENVIRONMENT;

const app = express();
app.use(helmet());

if(env === "dev") {
  http.createServer(app)
  .listen(config[env].server.port, () => {
    console.log(`App started on port ${config[env].server.port}`);
  });
}