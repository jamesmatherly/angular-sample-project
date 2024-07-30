import { Component, OnInit, Input, Output } from '@angular/core';
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
  @Output()
  positions: Map<string, Position[]>;

  constructor(private cognitoService: CognitoService,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    // Initialize component data here
    this.userDetails = this.cognitoService.getUserDetails();
    this.portfolioService.getPortfoliosForUser().subscribe(
      p => {
        this.portfolios = p;
        this.positions = new Map<string, Position[]>;
        this.portfolios.forEach( p => {
          this.portfolioService.getPositionsForPortfolio(p.id).subscribe(
            pos => {
              this.positions.set(p.id, pos);
              this.positions = new Map(this.positions)
            }
          );
        });
      }
    );

  }

  public getPositionsForPortfolio(portfolio: string): Position[]|undefined{
    return this.positions.get(portfolio);
  }
}
