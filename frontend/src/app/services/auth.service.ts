// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private access_token = 'access_token';
  private refresh_token = 'refresh_token';
  private user_data = 'user';

  constructor(private http: HttpClient) { }

  public getAuthorizationHeader(): HttpHeaders {
    const authToken = this.getAuthToken();
    return new HttpHeaders({ Authorization: `JWT ${authToken}` });
  }

  public getAuthToken(): string | null {
    return localStorage.getItem(this.access_token);
  }

  public setAuthToken(token: string, refresh: string): void {
    localStorage.setItem(this.access_token, token);
    localStorage.setItem(this.refresh_token, refresh);
  }

  /**
   * Social login for Google specifically
   * @param id_token Token gotten from first step social google auth
   * @returns HttpClient `Observable`
   */
  public socialLogin(id_token: string) {
    const loginUrl = `${this.apiUrl}/auth/login/google/`;
    const payload = {
      "jwt": id_token
    }
    return this.http.post(loginUrl, payload).pipe(
      tap((res: any) => {
        const access_token = res.access_token;
        const refresh_token = res.refresh_token;

        localStorage.setItem(this.access_token, access_token)
        localStorage.setItem(this.refresh_token, refresh_token)
        localStorage.setItem('tokenTime', new Date().getTime().toString());
        // this.getUserProfile();
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  verify(uid: string | null, token: string | null) {
    const loginUrl = `${this.apiUrl}/auth/users/activation/`;
    let verifyPayload = { uid, token };
    return this.http.post(loginUrl, verifyPayload)
  }

  resend(email: string) {
    const resendUrl = `${this.apiUrl}/auth/users/resend_activation/`;
    let loginPayload = { email };
    return this.http.post(resendUrl, loginPayload)
  }

  logout() {
    return localStorage.clear();
  }

  // getUserProfile() {
  //   const url = `${this.apiUrl}/auth/profile/`;
  //   const headers = this.getAuthorizationHeader();

  //   return this.http.get(url, { headers })
  //     .pipe(tap((res: any) => {
  //       localStorage.setItem('user', JSON.stringify(res))
  //     }));
  // }

  isAuth() {
    const token = this.getAuthToken();

    const tokenTime = localStorage.getItem('tokenTime');
    const currentTime = new Date().getTime();
    const tokenDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if ((token && tokenTime) == null) {
      const timeDiff = currentTime - Number(tokenTime);
      if (timeDiff > tokenDuration) {
        localStorage.clear();
        return false;
      }
    }

    const isAuthenticated = !!token;
    return isAuthenticated
  }
}
