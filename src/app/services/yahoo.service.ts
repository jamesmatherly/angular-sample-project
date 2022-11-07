import { StockDetails } from './../models/stock-details';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YahooService{

  url: string = 'http://api.jameslearnscloud.com/controller?ticker=';

  constructor(private http: HttpClient) { }

  getTickerSummary(ticker: string): Observable<any> {
    return this.http.get<StockDetails>(this.url + ticker);
  }

}
