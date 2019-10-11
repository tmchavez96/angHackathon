"use strict";
exports.__esModule = true;
var express_1 = require("express");
var express = require("express");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var db_controller_1 = require("./db.controller");
var app = express();
var db = new db_controller_1.DBController();
var RSA_PUBLIC_KEY = fs.readFileSync('bank-auth.pub');
app.use(express_1.json());
// this is necessary for the API to work on the same host as the angular app
// i don't know why
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
//Logger?
app.use(function (req, res, next) {
    console.log("Recieved " + req.path + " request from: " + req.hostname);
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
    var token = req.headers.authorization;
    jwt.verify(token, RSA_PUBLIC_KEY, { algorithms: ['RS256'] }, function (err, decoded) {
        if (err) {
            res.status(401).send({});
        }
        else {
            db.getPendingApps().then(function (result) {
                console.log("Retrieved all pending applications");
                res.status(200).json(result);
            })["catch"](function (err) {
                console.error(err);
                res.sendStatus(500);
            });
        }
    });
});
app.route("/actOnApplication").post(function (req, res) {
    var ssn = req.body.SSN;
    var approve = req.body.approve;
    var token = req.headers.authorization;
    jwt.verify(token, RSA_PUBLIC_KEY, { algorithms: ['RS256'] }, function (err, decoded) {
        if (err) {
            res.status(401).send({});
        }
        else {
            db.actOnApplication(ssn, approve).then(function () {
                console.log((approve ? "Approved " : "Denied") + " application with SSN " + ssn);
                res.status(200).send({});
            })["catch"](function (err) {
                res.sendStatus(500);
            });
        }
    });
});
app.listen(5555, function () {
    console.log("Server running...");
});
