"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var DBController = /** @class */ (function () {
    function DBController() {
        this.uri = "mongodb+srv://practiceuser:PDp56Vfc@practice-cluster-0kmjy.mongodb.net/admin?retryWrites=true&w=majority";
        this.client = new mongodb_1.MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.database = "bankdb";
    }
    DBController.prototype.getApplication = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.connect().then(function () {
                var collection = _this.client.db(_this.database).collection("accounts");
                return collection.findOne({ $or: [{ _id: mongodb_1.ObjectID(query.id) }, { SSN: query.SSN }] });
            }).then(function (r) {
                resolve(r);
            })["catch"](function (err) {
                reject(err);
            })["finally"](function () {
                _this.client.close();
            });
        });
    };
    DBController.prototype.submitApplication = function (applicationData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.connect().then(function () {
                var collection = _this.client.db(_this.database).collection("accounts");
                var credit = Math.floor(Math.random() * (850 - 500) + 500);
                return collection.insertOne({
                    firstName: applicationData.firstName,
                    lastName: applicationData.lastName,
                    middleInitial: applicationData.middleInitial,
                    SSN: applicationData.SSN,
                    citizen: applicationData.citizen,
                    resident: applicationData.resident,
                    otherCitizen: applicationData.otherCitizen,
                    residentialAddress: applicationData.residentialAddress,
                    mailingAddress: applicationData.mailingAddress,
                    email: applicationData.email,
                    phone: applicationData.phone,
                    bank: applicationData.bank,
                    employment: applicationData.employment,
                    occupation: applicationData.occupation,
                    annualIncome: applicationData.annualIncome,
                    monthlyRent: applicationData.monthlyRent,
                    creditScore: credit,
                    status: credit > 650 ? 1 : 0
                });
            }).then(function (r) {
                resolve(r);
            })["catch"](function (err) {
                reject(err);
            })["finally"](function () {
                _this.client.close();
            });
        });
    };
    DBController.prototype.actOnApplication = function (ssn, approve) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.connect().then(function () {
                var collection = _this.client.db(_this.database).collection("accounts");
                return collection.updateOne({ SSN: ssn }, { $set: { status: approve ? 1 : -1 } });
            }).then(function (result) {
                if (result.matchedCount > 0) {
                    resolve();
                }
                else {
                    reject();
                }
            })["catch"](function (err) {
                reject(err);
            })["finally"](function () {
                _this.client.close();
            });
        });
    };
    DBController.prototype.getPendingApps = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.connect().then(function () {
                var collection = _this.client.db(_this.database).collection("accounts");
                return collection.find({ status: 0 }).toArray();
            }).then(function (r) {
                resolve(r);
            })["catch"](function (err) {
                reject(err);
            })["finally"](function () {
                _this.client.close();
            });
        });
    };
    return DBController;
}());
exports.DBController = DBController;
