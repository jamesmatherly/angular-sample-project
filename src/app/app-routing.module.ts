import { HomePageComponent } from './components/home-page/home-page.component';
import { YahooProjectPageComponent } from './components/yahoo-project-page/yahoo-project-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'yahoo', component: YahooProjectPageComponent },
  { path: 'home', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
