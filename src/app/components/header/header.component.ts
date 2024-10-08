import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) {


  }

  ngOnInit(): void {
  }

  routeToHomePage() {
    this.router.navigate(['home']);
  }

  routeToYahooPage() {
    this.router.navigate(['yahoo']);
  }

  routeToDashboard() {
    this.router.navigate(['dashboard']);
  }

  routeToTradingPage() {
    this.router.navigate(['trading']);
  }

  routeToAboutPage() {
    this.router.navigate(['about']);
  }

  routeToWoodworkingPage() {
    this.router.navigate(['woodworking']);
  }
}
