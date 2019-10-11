import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApplicationService {

  constructor(private http: HttpClient) { }

  public submitApplication(data: any) {
    return this.http.post('http://localhost:5555/submitApplication/', data);
  }
}
