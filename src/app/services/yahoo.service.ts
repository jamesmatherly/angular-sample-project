import { StockDetails } from './../models/stock-details';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IUser, CognitoService } from '../services/cognito.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YahooService{

  url: string = `${environment.backendUrl}/finnhubQuote?ticker=`;
  loading: boolean;
  user: IUser;

  constructor(private http: HttpClient,
    private cognitoService: CognitoService
  ) {
    this.loading = false;
    this.user = {} as IUser;
  }

  async getTickerSummary(ticker: string): Promise<any> {
    let token: string = await this.cognitoService.getToken();
    if (!token) {
      this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/yahoo`);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(this.http.get<StockDetails>(this.url + ticker, {headers}));
  }

}
