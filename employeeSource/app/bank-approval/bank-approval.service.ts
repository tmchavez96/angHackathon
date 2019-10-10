import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BankApprovalService {

  constructor(private http: HttpClient) { }

  public getPendingApps() {
    return this.http.get('http://localhost:5555/getPendingApps/');
  }

  public actOnApplication(ssn: number, approve: boolean) {
    return this.http.post('http://localhost:5555/actOnApplication/', {
      SSN: ssn,
      approve: approve
    });
  }

}
