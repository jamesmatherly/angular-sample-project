import { StockDetails } from './../models/stock-details';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getTickerSummary(ticker: string): Observable<any> {
    let token: string = this.cognitoService.getToken();
    if (!token) {
      this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/yahoo`);
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<StockDetails>(this.url + ticker, {headers});
  }

}
