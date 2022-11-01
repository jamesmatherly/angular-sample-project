import { YahooService } from 'src/app/services/yahoo.service';
import { StockDetails } from '../../models/stock-details';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yahoo-project-page',
  templateUrl: './yahoo-project-page.component.html',
  styleUrls: ['./yahoo-project-page.component.scss']
})
export class YahooProjectPageComponent implements OnInit {

  ticker: string;
  stockDetails: StockDetails;

  constructor(private yahooService: YahooService) { }

  ngOnInit(): void {
  }

  getDetails(ticker: string) {
    this.ticker = ticker;
    this.yahooService.getTickerSummary(ticker).subscribe( (data) => this.stockDetails = data);
  }
}
