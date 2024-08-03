import { Injectable } from '@angular/core';
import { PortfolioDetails } from '../models/portfolio-details';
import { CognitoService, IUser } from './cognito.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

    public async getPortfoliosForUser() : Promise<PortfolioDetails[]> {
        const headers = await this.tokenCheck();
        return firstValueFrom(this.http.get<PortfolioDetails[]>(`${this.portfolioEndpoint}/username?username=${this.user['cognito:username']}`, {headers}));
    }

    public async getPositionsForPortfolio(portfolioId: string) : Promise<Position[]> {
        const headers = await this.tokenCheck();
        return firstValueFrom(this.http.get<Position[]>(`${this.portfolioEndpoint}/positions?portfolioId=${portfolioId}`, { headers }));
    }

    private async tokenCheck(): Promise<HttpHeaders> {
        let token: string = await this.cognitoService.getToken();
        if (!token) {
            this.cognitoService.redirectToCognitoLogin(`${environment.frontendUrl}/dashboard`);
        }
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });
    }

    public async getHistoricalData(ticker: string): Promise<AVTimeSeries> {
        const headers = await this.tokenCheck();
        return firstValueFrom(this.http.get<AVTimeSeries>(`${environment.backendUrl}/history?ticker=${ticker}`, { headers }));
    }

}
