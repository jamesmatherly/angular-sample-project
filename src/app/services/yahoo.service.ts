import { StockDetails } from './../models/stock-details';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IUser, CognitoService } from '../services/cognito.service';
import { environment } from '../../environments/environment';
import { Trade } from '../components/trading/trading.component';

@Injectable({
  providedIn: 'root'
})
export class YahooService{

  url: string = `${environment.backendUrl}/finnhubQuote?ticker=`;
  companyUrl: string = `${environment.backendUrl}/finnhubLookup?ticker=`;
  tradeUrl: string = `${environment.backendUrl}/trade`;
  loading: boolean;
  user: IUser;

  constructor(private http: HttpClient,
    private cognitoService: CognitoService
  ) {
    this.loading = false;
    this.user = {} as IUser;
  }

  async getTickerSummary(ticker: string): Promise<StockDetails> {
    let token: string = await this.cognitoService.getToken();
    if (!token) {
      this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/yahoo`);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(this.http.get<StockDetails>(this.url + ticker, {headers}));
  }

  async getTickerCompany(ticker: string): Promise<StockDetails> {
    let token: string = await this.cognitoService.getToken();
    if (!token) {
      this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/yahoo`);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return firstValueFrom(this.http.get<StockDetails>(this.companyUrl + ticker, {headers}));
  }

  async executeTrade(trade: any): Promise<string> {
    let token: string = await this.cognitoService.getToken();
    if (!token) {
      this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/yahoo`);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    for (const key in trade) {
      if (trade.hasOwnProperty(key)) {
        body.set(key, trade[key]);
      }
    }

    return firstValueFrom(this.http.post<string>(this.tradeUrl, body, {headers}));
  }

}
