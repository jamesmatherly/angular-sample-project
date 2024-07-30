import { Injectable } from '@angular/core';
import { PortfolioDetails } from '../models/portfolio-details';
import { CognitoService, IUser } from './cognito.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position';
import { AVTimeSeries } from '../models/alpha-vantage-time-series';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    private user: IUser;
    private portfolioEndpoint = `${environment.backendUrl}/portfolio`;

    constructor(private cognitoService: CognitoService,
        private http: HttpClient
    ) {
        this.user = cognitoService.getUserDetails();
    }

    public getPortfoliosForUser() : Observable<PortfolioDetails[]> {
        const headers = this.tokenCheck();
        return this.http.get<PortfolioDetails[]>(`${this.portfolioEndpoint}/username?username=${this.user['cognito:username']}`, {headers});
    }

    public getPositionsForPortfolio(portfolioId: string) : Observable<Position[]> {
        const headers = this.tokenCheck();
        return this.http.get<Position[]>(`${this.portfolioEndpoint}/positions?portfolioId=${portfolioId}`, { headers });
    }

    private tokenCheck(): HttpHeaders {
        let token: string = this.cognitoService.getToken();
        if (!token) {
            this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/dashboard`);
        }
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });
    }

    public getHistoricalData(ticker: string): Observable<AVTimeSeries> {
        const headers = this.tokenCheck();
        return this.http.get<AVTimeSeries>(`${environment.backendUrl}/history?ticker=${ticker}`, { headers });
    }

}