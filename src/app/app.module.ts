import { DemoNgZorroAntdModule } from './ng-zorro-antd/ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YahooProjectPageComponent } from './components/yahoo-project-page/yahoo-project-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import  'ng-zorro-antd';
import { HeaderComponent } from './components/header/header.component';
import { TickerSearchComponent } from './components/ticker-search/ticker-search.component';
import { YahooResultDisplayComponent } from './components/yahoo-result-display/yahoo-result-display.component';
import { AboutPageComponent } from './components/about-page/about-page.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    YahooProjectPageComponent,
    HomePageComponent,
    HeaderComponent,
    TickerSearchComponent,
    YahooResultDisplayComponent,
    AboutPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoNgZorroAntdModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
