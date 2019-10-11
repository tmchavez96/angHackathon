import { Request, Response, Express, json } from "express";
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

const app: Express = express();
const RSA_PRIVATE_KEY = fs.readFileSync('bank-auth.key');

app.use(json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use((req, res, next) => {
  console.log("Recieved authentication request from " + req.hostname);
  next();
});

app.route("/login").post((req: Request, res: Response) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username == 'banker' && password == 'banker') {
    // authenticated
    const options = {
      algorithm: 'RS256',
      expiresIn: 120,
      subject: username
    };
    jwt.sign({}, RSA_PRIVATE_KEY, options, (err, token) => {

      res.status(200).json({
        token: token,
        expiresIn: options.expiresIn
      });

    });

  } else {
    // unauthorized
    res.sendStatus(401);
  }

});

app.listen(5556, () => {
  console.log("Server running...");
});