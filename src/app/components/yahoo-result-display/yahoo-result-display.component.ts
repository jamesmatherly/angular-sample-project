import { StockDetails } from '../../models/stock-details';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-yahoo-result-display',
  templateUrl: './yahoo-result-display.component.html',
  styleUrls: ['./yahoo-result-display.component.scss']
})
export class YahooResultDisplayComponent implements OnInit {

  @Input()
  stockDetails: StockDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
