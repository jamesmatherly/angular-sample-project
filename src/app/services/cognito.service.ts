import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';


export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

export interface CognitoToken {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private clientId = environment.cognitoClientId;
  private clientSecret = environment.cognitoClientSecret;
  private redirectUri = environment.cognitoRedirectUri;
  private cognitoDomain = environment.cognitoDomain;

  constructor(private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // Redirect user to Cognito Hosted UI for authentication
  public redirectToCognitoLogin(returnUrl?: string): void {
    const state = returnUrl ? encodeURIComponent(returnUrl) : '';
    const loginUrl = `https://${this.cognitoDomain}/login?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}`;
    window.location.href = loginUrl;
  }

  // Exchange authorization code for tokens
  public handleAuthCode(code: string): void {
    const tokenUrl = `https://${this.cognitoDomain}/oauth2/token`;

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId)
      .set('code', code)
      .set('redirect_uri', this.redirectUri);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
    });

    try {
      const secure = false; // Set to true if you're serving over HTTPS
      const sameSite = 'None'; // You can use 'Lax' or 'None' based on your requirement
      this.http.post(tokenUrl, body.toString(), { headers }).subscribe(
        token => this.cookieService.set('tokens', JSON.stringify(token), 1, '/', '', secure, sameSite)
      );
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  public getToken(): string {
    let tokens = this.cookieService.get('tokens');
    if(tokens) {
      console.log(tokens);
      let token: CognitoToken = JSON.parse(tokens);
      const decodedToken: any = jwtDecode(token.access_token);
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp < currentTime) {
        this.refreshToken(token.refresh_token);
      }
      return token.access_token;
    } else {
      return '';
    }
  }

  public refreshToken(refreshToken: string): void {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', this.clientId);
    body.set('refresh_token', refreshToken);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    const secure = false; // Set to true if you're serving over HTTPS
    const sameSite = 'None'; // You can use 'Lax' or 'None' based on your requirement
    this.http.post(`https://${this.cognitoDomain}/oauth2/token` , body.toString(), { headers }).subscribe(
      token => this.cookieService.set('tokens', JSON.stringify(token), 1, '/', '', secure, sameSite)
    );
  }

  // Example method to make authenticated API calls
  public async callApiWithToken(apiUrl: string): Promise<any> {
    const token = this.cookieService.get('tokens');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.get(apiUrl, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }
}

