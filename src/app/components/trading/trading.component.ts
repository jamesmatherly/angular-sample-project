import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { PortfolioDetails } from 'src/app/models/portfolio-details';
import { StockDetails } from 'src/app/models/stock-details';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { YahooService } from 'src/app/services/yahoo.service';

export interface Trade {
  portfolioId: string;
  tradeType: string;
  executionType: string;
  executionTime: Date,
  quantity: number,
  name: string;
  value: number;
  ticker: string;
}

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent implements OnInit {
  portfolios: PortfolioDetails[] = [];
  trade: Trade = <Trade> {};
  lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };
  lineChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true
      },
      legend: {
        display: true
      }
    }
  };
  lineChartColors = [
    {
      backgroundColor: 'rgba(0,123,255,0.2)',
      borderColor: 'rgba(0,123,255,1)',
      pointBackgroundColor: 'rgba(0,123,255,1)',
      pointBorderColor: '#fff'
    }
  ];
  lineChartLegend = true;
  lineChartType: ChartConfiguration<'line'>['type'] = 'line';

  onPage: StockDetails;
  ticker: string;
  companyName: string;

  constructor(
    private portfolioService: PortfolioService,
    private yahooService: YahooService
  ) {}

  ngOnInit() {
    this.loadPortfolios();
  }

  loadPortfolios() {
    this.portfolioService.getPortfoliosForUser().then(
      p => this.portfolios = p
    );
  }

  searchStocks() {
    var detail: StockDetails;
    if (this.ticker) {
      this.ticker = this.ticker.toUpperCase();
      this.yahooService.getTickerSummary(this.ticker).then( (data) => {
        detail = data;
        detail.ticker = this.ticker;
        this.onPage = data;
        this.onPage.ticker = detail.ticker;
        console.log(data);
      });
      this.yahooService.getTickerCompany(this.ticker).then((data:any) => {
        this.companyName = data["result"].find((d: any) => d["symbol"]==this.ticker)["description"] as string;
      });
    }
  }

  updateChart(history: any) {
    // this.lineChartData = {
    //   datasets: [
    //     {
    //       data: history.map(point => ({ x: new Date(point.date), y: point.value })),
    //       label: this.stock.symbol,
    //       fill: 'origin'
    //     }
    //   ],
    //   labels: history.map(point => new Date(point.date))
    // };
  }

  submitTrade() {
    this.trade.ticker = this.ticker;
    console.log('-----');
    console.log(JSON.stringify(this.trade));
    console.log('-----');
    this.yahooService.executeTrade(this.trade);
    // this.tradeService.executeTrade(this.trade).subscribe(() => {
    //   this.loadPortfolios();
    // });
  }
}
