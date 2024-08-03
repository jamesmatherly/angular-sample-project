import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';


export interface IUser {
  email: string;
  name: string;
  "cognito:username": string;
}

export interface CognitoToken {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

export interface CognitoInitiateAuthResponse {
  "AuthenticationResult": {
      "AccessToken": string,
      "ExpiresIn": number,
      "IdToken": string,
      "NewDeviceMetadata": {
        "DeviceGroupKey": string,
        "DeviceKey": string
      },
      "RefreshToken": string,
      "TokenType": string
  },
  "ChallengeName": string,
  "ChallengeParameters": {
      "string" : string
  },
  "Session": string
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private clientId = environment.cognitoClientId;
  private clientSecret = environment.cognitoClientSecret;
  private redirectUri = environment.cognitoRedirectUri;
  private cognitoDomain = environment.cognitoDomain;
  private cognitoUrl = environment.cognitoUrl;

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) {}

  // Redirect user to Cognito Hosted UI for authentication
  public redirectToCognitoLogin(returnUrl?: string): void {
    const state = returnUrl ? encodeURIComponent(returnUrl) : '';
    const loginUrl = `https://${this.cognitoDomain}/login?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}`;
    window.location.href = loginUrl;
  }

  // Exchange authorization code for tokens
  public handleAuthCode(code: string, state: string): void {
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
        token => {
          this.cookieService.set('tokens', JSON.stringify(token), 1, '/', '', secure, sameSite);
          window.location.href = state;
      });
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  public async getToken(): Promise<string> {
    let tokens = this.cookieService.get('tokens');
    if(tokens) {
      let token: CognitoToken = JSON.parse(tokens);
      const decodedToken: any = jwtDecode(token.access_token);
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp < currentTime) {
        console.log("Expired token. Refreshing...");
        let refresh: CognitoInitiateAuthResponse = await this.refreshToken(token.refresh_token);
        token = {
          id_token: refresh['AuthenticationResult']['AccessToken'],
          access_token: refresh['AuthenticationResult']['IdToken'],
          refresh_token: refresh['AuthenticationResult']['RefreshToken']
        }

        console.log('Token refreshed:');
      }

      return token.access_token;
    } else {
      return '';
    }
  }

  public async refreshToken(refreshToken: string): Promise<CognitoInitiateAuthResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    });
    let hash: string | void = await this.computeSecretHash();

    if(hash) {
      console.log(hash);
      const body = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: hash, // Add SECRET_HASH here
        },
      };
      return firstValueFrom(this.http.post<CognitoInitiateAuthResponse>(this.cognitoUrl, JSON.stringify(body), { headers }));
    } else {
      let emptyObject: CognitoInitiateAuthResponse = {
        AuthenticationResult: {
          AccessToken: '',
          ExpiresIn: 0,
          IdToken: '',
          NewDeviceMetadata: {
            DeviceGroupKey: '',
            DeviceKey: ''
          },
          RefreshToken: '',
          TokenType: ''
        },
        ChallengeName: '',
        ChallengeParameters: {
          string: ''
        },
        Session: ''
      };
      return emptyObject;
    }
  }

  public getUserDetails(): IUser {
    let tokenString: string = this.cookieService.get('tokens');
    if (tokenString) {
      let token = JSON.parse(tokenString);
      let userDetails: IUser = jwtDecode(token.id_token);
      return userDetails;
    } else {
      return {
        email: '',
        name: '',
        "cognito:username": ''
      };
    }
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

  private async computeSecretHash(): Promise<string> {
    const encoder = new TextEncoder();
    const username = this.getUserDetails()['cognito:username'];
    const keyData = encoder.encode(this.clientSecret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const data = encoder.encode(username + this.clientId);
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const base64Hash = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return base64Hash;
  }
}

