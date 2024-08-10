import { Component, OnInit, Input, Output } from '@angular/core';
import { ChartType } from 'chart.js';
import { AVTimeSeries } from 'src/app/models/alpha-vantage-time-series';
import { PortfolioDetails } from 'src/app/models/portfolio-details';
import { Position } from 'src/app/models/position';
import { CognitoService, IUser } from 'src/app/services/cognito.service';
import { PortfolioService } from 'src/app/services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userDetails: IUser;
  portfolios: PortfolioDetails[];
  positions: Map<string, Position[]>;

  @Output()
  datasets: Map<string, any[]|undefined>;

  constructor(private cognitoService: CognitoService,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    // Initialize component data here
    this.userDetails = this.cognitoService.getUserDetails();
    this.portfolioService.getPortfoliosForUser().then(
      (portfolios) => {
        this.portfolios = portfolios;
        this.positions = new Map<string, Position[]>();

        // Create an array of promises for all positions
        const positionPromises = this.portfolios.map((portfolio) =>
          this.portfolioService.getPositionsForPortfolio(portfolio.id).then(
            (positions) => {
              this.positions.set(portfolio.id, positions);
            }
          )
        );

        // Wait for all promises to complete
        Promise.all(positionPromises).then(() => {
          // Call your method after all positions are retrieved
          this.handleAllPositionsRetrieved();
        }).catch((error) => {
          console.error('Error retrieving positions:', error);
        });
      }
    );
  }

  handleAllPositionsRetrieved() {
    // Process the positions here, or perform actions after all positions are retrieved
    this.portfolios.forEach(p => this.loadChartData(p.id));
  }

  public getPositionsForPortfolio(portfolio: string): Position[]|undefined{
    return this.positions.get(portfolio);
  }

  loadChartData(portfolioId: string): void {
    let lineChartType: ChartType = 'line';
    let positionsForPortfolio: Position[]|undefined = this.positions.get(portfolioId);
    if (positionsForPortfolio) {
      for (const p of positionsForPortfolio) {
        let histObs: Promise<AVTimeSeries> = this.portfolioService.getHistoricalData(p.ticker);
        histObs.then(
          h => {
            let stockValues: number[] = [];
            let labels: string[] = [];
            let dv2: any[] = [];
            let hMap= new Map(Object.entries(h["Time Series (Daily)"]));
            hMap.forEach(
              (value, key) => {
                labels.push(key);
                stockValues.push(Number.parseFloat(JSON.stringify(value["1. open"])));
                let t = {
                    x: new Date(key).getTime(),
                    y: Number.parseFloat(JSON.stringify(value["1. open"]))
                };
                dv2.push(t);
              }
            );

            const apiData = {
              type: lineChartType,
              data: dv2,
              label: p.ticker,
              backgroundColor: 'rgba(148,159,177,0.2)',
              borderColor: 'rgba(148,159,177,1)',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)',
              fill: 'origin',
              pointRadius: 0, // Hide points by default
              pointHoverRadius: 8 // Show points on hover
            };

            this.applyRandomColors(apiData);
            this.datasets = new Map();
            let dataset = this.datasets.get(portfolioId);
            if (!dataset) {
              dataset = [];
            }
            dataset?.push(apiData);
            this.datasets.set(portfolioId, dataset);
          }
        );
      };
    }
  }

  // Function to generate a random RGB color
  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b}`;
  }

  // Apply random colors to each dataset
  applyRandomColors(dataset: any): void {
    const randomColor = this.generateRandomColor();
    dataset.borderColor = randomColor + '1';
    dataset.backgroundColor = randomColor + ', 0.15';
  }
}
