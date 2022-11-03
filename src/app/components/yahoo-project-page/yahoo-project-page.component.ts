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
  onPage: StockDetails[] = [];

  constructor(private yahooService: YahooService) { }

  ngOnInit(): void {
  }

  getDetails() {
    var detail: StockDetails;
    this.yahooService.getTickerSummary(this.ticker).subscribe( (data) => {
      detail = data;
      detail.ticker = this.ticker
      this.onPage = [detail, ...this.onPage];
      this.ticker = "";
    });

  }
}
