import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  // TODO get all information back from service to create the User Model
  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Gets the token
   */
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  /**
   * Gets the auth status to be able to be checked in other components
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   * Creates a new user when we use the sign-up component that uses AuthData
   * model to send email/password to Node.
   * User will then be signed into the application.
   * @param email email input from the user
   * @param password password input from the user
   */
  createUser(firstName: string, lastName: string, email: string, password: string) {
    const userData = {firstName, lastName, email, password};
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://68.183.133.196/api/user/sign-up', userData)
      .subscribe(response => {
        // TODO: Add welcome message to new user with a popup******
        this.signIn(authData.email, authData.password);
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
    this.http.post<{token: string, expiresIn: number, userId: string, firstName: string, lastName: string}>('http://68.183.133.196/api/user/sign-in', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          // CAN NOW ACCESS FIRST AND LAST NAME
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  signOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.signOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
