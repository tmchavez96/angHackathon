import { Request, Response, Express, json } from "express";
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

import { DBController } from './db.controller'

const app: Express = express();
const db: DBController = new DBController();

const RSA_PUBLIC_KEY = fs.readFileSync('bank-auth.pub');

app.use(json());

// this is necessary for the API to work on the same host as the angular app
// i don't know why
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//Logger?
app.use((req, res, next) => {
  console.log("Recieved " + req.path + " request from: " + req.hostname);
  next();
});

app.route("/submitApplication").post((req: Request, res: Response) => {
  const applicationData = req.body;

  // serverside validation?

  db.submitApplication(applicationData).then((result) => {
    console.log("Submitted application: " + result.insertedId);
    res.status(200).json({
      id: result.insertedId,
      autoApproved: result.ops[0].status == 1
    });
  }).catch((err) => {
    if (err.code == 11000) {
      res.sendStatus(487);
    } else {
      console.error(err);
      res.sendStatus(500);
    }
  });

});

app.route("/getCMInfo").post((req: Request, res: Response) => {
  const query = req.body;

  // serverside validation?

  db.getApplication(query).then((result) => {
    if (result) {
      // found
      console.log("Retrieved card member info: " + result._id);
      res.status(200).json({
        id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        middleInitial: result.middleInitial,
        SSN: result.SSN,
        citizen: result.citizen,
        resident: result.resident,
        otherCitizen: result.otherCitizen,
        email: result.email,
        phone: result.phone,
        bank: result.bank,
        status: result.status
      });
    } else {
      // does not exist
      res.status(200).json(null);
    }
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });

});

app.route("/getHousingInfo").post((req: Request, res: Response) => {
  const query = req.body;

  // serverside validation?

  db.getApplication(query).then((result) => {
    if (result) {
      // found
      console.log("Retrieved housing info: " + result._id);
      res.status(200).json({
        id: result._id,
        residentialAddress: result.residentialAddress,
        mailingAddress: result.mailingAddress,
        monthlyRent: result.monthlyRent,
        status: result.status
      });
    } else {
      // does not exist
      res.status(200).json(null);
    }
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });

});

app.route("/getEmploymentInfo").post((req: Request, res: Response) => {
  const query = req.body;

  // serverside validation?

  db.getApplication(query).then((result) => {
    if (result) {
      // found
      console.log("Retrieved employment info: " + result._id);
      res.status(200).json({
        id: result._id,
        employment: result.employment,
        occupation: result.occupation,
        annualIncome: result.annualIncome,
        status: result.status
      });
    } else {
      // does not exist
      res.status(200).json(null);
    }
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });

});

app.route("/checkStatus/:id").get((req: Request, res: Response) => {
  const id = req.params.id;

  db.getApplication({ id: id }).then((result) => {
    if (result) {
      // found
      console.log("Retrieved application status: " + result._id);
      res.status(200).json({
        status: result.status
      });
    } else {
      // does not exist
      res.status(200).json(null);
    }
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

app.route("/getPendingApps").get((req: Request, res: Response) => {

  const token = req.headers.authorization;

  jwt.verify(token, RSA_PUBLIC_KEY, {algorithms: ['RS256']}, (err, decoded) => {
    if (err) {
      res.status(401).send({});
    } else {
      db.getPendingApps().then((result) => {
        console.log("Retrieved all pending applications");
        res.status(200).json(result);
      }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  });

});

app.route("/actOnApplication").post((req: Request, res: Response) => {
  const ssn = req.body.SSN;
  const approve = req.body.approve;

  const token = req.headers.authorization;

  jwt.verify(token, RSA_PUBLIC_KEY, {algorithms: ['RS256']}, (err, decoded) => {
    if (err) {
      res.status(401).send({});
    } else {
      db.actOnApplication(ssn, approve).then(() => {
        console.log((approve ? "Approved " : "Denied") + " application with SSN " + ssn);
        res.status(200).send({});
      }).catch((err) => {
        res.sendStatus(500);
      });
    }
  });

});

app.listen(5555, () => {
  console.log("Server running...");
});
