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

  routeToAboutPage() {
    this.router.navigate(['about']);
  }
}
