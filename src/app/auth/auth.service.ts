import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, AuthCache } from './auth-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private autenticato: boolean;
  private token: string;
  private authListner = new Subject<boolean>();
  private timer: any;
  private authCache: AuthCache;

  constructor(private http: HttpClient, private router: Router) {

    this.authCache = new AuthCache("", "");

  }

  createUser(email: string, password: string) {

    const authData: AuthData = {
      email: email, password: password
    }

    this.http.post("http://localhost:3000/api/users/signup", authData).subscribe(response => {
      this.router.navigate(['/login']);
    });
  }

  autoAuthUser() {

    if (this.authCache.isValidToken()) {

      this.setTimer(this.authCache.expireRimanente);

      this.authListner.next(true);

      this.autenticato = true;

      this.router.navigate(['/']);
    }
  }

  login(email: string, password: string) {

    const authData: AuthData = {
      email: email, password: password
    }

    this.http.post<{ token: string, expire: number, uId: string }>("http://localhost:3000/api/users/login", authData).subscribe(response => {

      if (response.token) {

        this.authCache.saveLocal(response.token, response.expire, response.uId);

        this.setTimer(response.expire);

        this.token = response.token;

        this.authListner.next(true);

        this.autenticato = true;

        this.router.navigate(['/']);
      }
    });
  }

  private setTimer(durata: number) {

    this.timer = setTimeout(() => {
      this.logout();
    }, durata);
  }

  logout() {

    clearTimeout(this.timer);

    this.authCache.deleteLocal();

    this.token = null;

    this.autenticato = false;

    this.authListner.next(this.autenticato);

    this.router.navigate(['/']);
  }

  getUserId(): string {
    return this.authCache.userId;
  }  

  getToken(): string {
    //return this.token;
    return this.authCache.tokenU;
  }

  getAuthStatus(): boolean {
    return this.autenticato;
  }

  getAuthListner() {
    return this.authListner.asObservable();
  }
}
