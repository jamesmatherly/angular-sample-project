import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Position } from 'src/app/models/position';
import { AVTimeSeries } from 'src/app/models/alpha-vantage-time-series';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input()
  positions!: Position[]|undefined;


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [

    ],
    labels: [],
  };

  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },
    annotation: {},
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(private portfolioService: PortfolioService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this. positions) {
      console.log(this.positions[0]);
      for (const p of this.positions) {
        let histObs: Observable<AVTimeSeries> = this.portfolioService.getHistoricalData(p.ticker);
        histObs.subscribe(
          h => {
            let stockValues: number[] = [];
            let labels: string[] = [];
            let hMap= new Map(Object.entries(h["Time Series (Daily)"]));
            hMap.forEach(
              (value, key) => {
                labels.push(key);
                stockValues.push(Number.parseFloat(JSON.stringify(value["1. open"])));
              }
            );
            const apiData = {
              data: stockValues,
              label: p.ticker,
              backgroundColor: 'rgba(148,159,177,0.2)',
              borderColor: 'rgba(148,159,177,1)',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)',
              fill: 'origin',
            };

            this.lineChartData.datasets.push(apiData);
            this.lineChartData.labels = labels;
            this.chart?.update();
          }
        );
      };
    }
  }

  chartHovered(event: any): void {
    console.log(event);
  }

  chartClicked(event: any): void {
    console.log(event);
  }
}
