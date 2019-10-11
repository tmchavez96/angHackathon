"use strict";
exports.__esModule = true;
var express_1 = require("express");
var express = require("express");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var app = express();
var RSA_PRIVATE_KEY = fs.readFileSync('bank-auth.key');
app.use(express_1.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(function (req, res, next) {
    console.log("Recieved authentication request from " + req.hostname);
    next();
});
app.route("/login").post(function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == 'banker' && password == 'banker') {
        // authenticated
        var options_1 = {
            algorithm: 'RS256',
            expiresIn: 120,
            subject: username
        };
        jwt.sign({}, RSA_PRIVATE_KEY, options_1, function (err, token) {
            res.status(200).json({
                token: token,
                expiresIn: options_1.expiresIn
            });
        });
    }
    else {
        // unauthorized
        res.sendStatus(401);
    }
});
app.listen(5556, function () {
    console.log("Server running...");
});
