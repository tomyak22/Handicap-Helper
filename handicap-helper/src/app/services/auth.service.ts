import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Creates a new user when we use the sign-up component that uses AuthData
   * model to send email/password to Node.
   * @param email email input from the user
   * @param password password input from the user
   */
  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/sign-up', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  /**
   * Logs an existing user into the app from the sign-in component using AuthData
   * model.
   * @param email email input from the user
   * @param password password input from the user
   */
  signIn(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/sign-in', authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
