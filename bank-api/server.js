"use strict";
exports.__esModule = true;
var express_1 = require("express");
var express = require("express");
var db_controller_1 = require("./db.controller");
var app = express();
var db = new db_controller_1.DBController();
app.use(express_1.json());
// this is necessary for the API to work on the same host as the angular app
// i don't know why
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.route("/submitApplication").post(function (req, res) {
    var applicationData = req.body;
    // serverside validation?
    db.submitApplication(applicationData).then(function (result) {
        console.log("Submitted application: " + result.insertedId);
        res.status(200).json({
            id: result.insertedId,
            autoApproved: result.ops[0].status == 1
        });
    })["catch"](function (err) {
        if (err.code == 11000) {
            res.sendStatus(487);
        }
        else {
            console.error(err);
            res.sendStatus(500);
        }
    });
});
app.route("/getCMInfo").post(function (req, res) {
    var query = req.body;
    // serverside validation?
    db.getApplication(query).then(function (result) {
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
        }
        else {
            // does not exist
            res.status(200).json(null);
        }
    })["catch"](function (err) {
        console.error(err);
        res.sendStatus(500);
    });
});
app.route("/getHousingInfo").post(function (req, res) {
    var query = req.body;
    // serverside validation?
    db.getApplication(query).then(function (result) {
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
        }
        else {
            // does not exist
            res.status(200).json(null);
        }
    })["catch"](function (err) {
        console.error(err);
        res.sendStatus(500);
    });
});
app.route("/getEmploymentInfo").post(function (req, res) {
    var query = req.body;
    // serverside validation?
    db.getApplication(query).then(function (result) {
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
        }
        else {
            // does not exist
            res.status(200).json(null);
        }
    })["catch"](function (err) {
        console.error(err);
        res.sendStatus(500);
    });
});
app.route("/checkStatus/:id").get(function (req, res) {
    var id = req.params.id;
    db.getApplication({ id: id }).then(function (result) {
        if (result) {
            // found
            console.log("Retrieved application status: " + result._id);
            res.status(200).json({
                status: result.status
            });
        }
        else {
            // does not exist
            res.status(200).json(null);
        }
    })["catch"](function (err) {
        console.error(err);
        res.sendStatus(500);
    });
});
app.route("/getPendingApps").get(function (req, res) {
    db.getPendingApps().then(function (result) {
        res.status(200).json(result);
    })["catch"](function (err) {
        console.error(err);
        res.sendStatus(500);
    });
});
app.route("/actOnApplication").post(function (req, res) {
    var ssn = req.body.SSN;
    var approve = req.body.approve;
    db.actOnApplication(ssn, approve).then(function () {
        res.status(200).send({});
    })["catch"](function (err) {
        res.sendStatus(500);
    });
});
// getCreditScore probably wont be needed sooooooooooooooooooooooooooooooooooo i'm not adding it until we do
// it's a random number anyways....
app.listen(5555, function () {
    console.log("Server running...");
});
/*
db.submitApplication({
  "firstName": "Test",
  "lastName": "Tester",
  "middleInitial": "T",
  "SSN": 123127234,
  "citizen": "United States",
  "resident": null,
  "otherCitizen": null,
  "residentialAddress": "1234 Address Dr, Austin, TX 77777",
  "mailingAddress": null,
  "email": "test@gmail.com",
  "phone": 1231231234,
  "bank": "CheckingSavings",
  "employment": "Employed",
  "occupation": "Software Engineer",
  "annualIncome": 77777,
  "monthlyRent": 1000
}).then((result) => {
  console.log("Submitted application: " + result.insertedId);
}).catch((err) => {
  if (err.code == 11000) {
    console.error("Duplicate SSN");
  } else {
    console.error(err);
  }
});

db.submitApplication({
  firstName: "Testee",
  lastName: "Tests",
  middleInitial: "T",
  SSN: 123121235,
  citizen: "United States",
  resident: null,
  otherCitizen: null,
  residentialAddress: "1234 Place Dr, Austin, TX 77777",
  mailingAddress: null,
  email: "testee@gmail.com",
  phone: 1231231234,
  bank: "CheckingSavings",
  employment: "Employed",
  occupation: "Software Engineer",
  annualIncome: 50000,
  monthlyRent: 1200
}).then((result) => {
  console.log("Submitted application: " + result.insertedId);
}).catch((err) => {
  console.error(err);
});
*/ 
