import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Position } from 'src/app/models/position';
import { AVTimeSeries } from 'src/app/models/alpha-vantage-time-series';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input()
  apiData!: any[]|undefined;

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [

    ],
    labels: [],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {
        type: 'time',
        time: {
          unit: 'month'
        },
        title: {
          display: true,
          text: 'Date'
        },
        adapters: {
          date: {
            locale: enUS,
          },
        }
      },
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
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    hover: {
      mode: 'index',
      intersect: false,
    }
  };


  constructor(private portfolioService: PortfolioService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.apiData) {
      for (const d of this.apiData) {
        this.lineChartData.datasets.push(d);
        this.applyRandomColors();
      }
      this.chart?.update();
    }
  }

  chartHovered(event: any): void {
    console.log(event);
  }

  chartClicked(event: any): void {
    console.log(event);
  }

  // Function to generate a random RGB color
  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b}`;
  }

  // Apply random colors to each dataset
  applyRandomColors(): void {
    this.lineChartData.datasets.forEach((dataset) => {
      const randomColor = this.generateRandomColor();
      dataset.borderColor = randomColor + '1';
      dataset.backgroundColor = randomColor + ', 0.15';
    });
  }
}
