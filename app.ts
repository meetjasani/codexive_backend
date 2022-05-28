import express, { Application, Request, Response } from "express";
import { createConnection } from "typeorm";
import { setup } from "./src/api/routes";
import { development, production, test } from "./src/database/config";
import cors from "cors";
import { errors } from "celebrate";
import dotenv from "dotenv";
import { setSwagger } from "./swagger";
import helmet from "helmet";
import schedule from "node-schedule";

import * as https from 'https';
import * as fs from 'fs';
import * as util from 'util'

// var privateKey  = fs.readFileSync('key.pem', 'utf8');
// var certificate = fs.readFileSync('cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

dotenv.config();

let environment;

switch (process.env.NODE_ENV) {
  case "development":
    environment = development;
    break;
  case "production":
    environment = production;
  default:
    break;
}

const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(cors());

app.all("*", function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization ,Accept"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

app.use(express.json());

app.use(helmet());
app.set("trust proxy", true);

app.use("/images", express.static("images"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: `Codexive Solution backend:${PORT}`,
  });
});


setSwagger(app);
setup(app);
app.use(errors());

createConnection(environment)
  .then(() => {
    // var httpsServer = https.createServer(credentials, app);
    app.listen(PORT, () =>
      console.log(`App is running: 🚀 https://localhost:${PORT} 🚀`)
    );
  })
  .catch((e) => {
    console.log("Error: ", e);
  });
