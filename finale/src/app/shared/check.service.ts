import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class CheckService {

  constructor(private http: HttpClient) { }

  public checkStatus(appId: string) {
    return this.http.get('http://localhost:5555/checkStatus/' + appId);

    /* Example post
    return this.http.post('http://localhost:5555/checkStatus', {
      id: appId 
    });
    */
  }

}
