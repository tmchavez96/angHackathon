import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string) {
    return this.http.post('http://localhost:5556/login', {username, password});
  }

  public setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );

    localStorage.setItem('token', authResult.token);
  }

  public get isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
    //return localStorage.getItem("token") != null;
  }

  public get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  private getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
