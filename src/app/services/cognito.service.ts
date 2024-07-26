import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';


export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
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
  public handleAuthCode(code: string): Observable<any> {
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
      return this.http.post(tokenUrl, body.toString(), { headers });
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  // Example method to make authenticated API calls
  public async callApiWithToken(apiUrl: string): Promise<any> {
    const token = this.cookieService.get('accessToken');
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

