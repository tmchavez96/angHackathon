import { MongoClient, ObjectID } from 'mongodb';

export class DBController {

  private uri: string;
  private client: MongoClient;
  private database: string;

  constructor() {
    this.uri = "mongodb+srv://practiceuser:PDp56Vfc@practice-cluster-0kmjy.mongodb.net/admin?retryWrites=true&w=majority";
    this.client = new MongoClient(this.uri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.database = "bankdb";
  }

  public getApplication(query: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.client.connect().then(() => {
        const collection = this.client.db(this.database).collection("accounts");
        return collection.findOne({ $or: [{_id: ObjectID(query.id)}, {SSN: query.SSN}] });
      }).then((r) => {
        resolve(r);
      }).catch((err) => {
        reject(err);
      }).finally(() => {
        this.client.close();
      });

    });
  }

  public submitApplication(applicationData: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.client.connect().then(() => {
        const collection = this.client.db(this.database).collection("accounts");
        const credit = Math.floor(Math.random() * (850 - 500) + 500);
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
      }).then((r) => {
        resolve(r);
      }).catch((err) => {
        reject(err);
      }).finally(() => {
        this.client.close();
      });

    });
  }

  public actOnApplication(ssn: number, approve: boolean): Promise<any> {
    return new Promise((resolve, reject) => {

      this.client.connect().then(() => {
        const collection = this.client.db(this.database).collection("accounts");
        return collection.updateOne({ SSN: ssn }, {$set: { status: approve ? 1 : -1 }});
      }).then((result) => {
        if (result.matchedCount > 0) {
          resolve();
        } else {
          reject();
        }
      }).catch((err) => {
        reject(err);
      }).finally(() => {
        this.client.close();
      });

    });
  }

  public getPendingApps(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.client.connect().then(() => {
        const collection = this.client.db(this.database).collection("accounts");
        return collection.find({ status: 0 }).toArray();
      }).then((r) => {
        resolve(r);
      }).catch((err) => {
        reject(err);
      }).finally(() => {
        this.client.close();
      });

    });
  }

}