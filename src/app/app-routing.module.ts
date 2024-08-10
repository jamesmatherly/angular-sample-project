import { AboutPageComponent } from './components/about-page/about-page.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { WoodworkingPageComponent } from './components/woodworking-page/woodworking-page.component';
import { YahooProjectPageComponent } from './components/yahoo-project-page/yahoo-project-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradingComponent } from './components/trading/trading.component';

const routes: Routes = [
  { path: 'yahoo', component: YahooProjectPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'woodworking', component: WoodworkingPageComponent },
  { path: 'callback', component: AuthCallbackComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'trading', component: TradingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
