import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { YahooService } from 'src/app/services/yahoo.service';

@Component({
  selector: 'app-ticker-search',
  templateUrl: './ticker-search.component.html',
  styleUrls: ['./ticker-search.component.scss']
})
export class TickerSearchComponent implements OnInit {

  @Output()
  updatedTicker: EventEmitter<string> = new EventEmitter();
  ticker: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  updateTicker() {
    this.updatedTicker.emit(this.ticker);
  }

}
