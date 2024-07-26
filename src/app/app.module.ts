import { AngularMaterialsModule } from './angular-materials/angular-materials.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YahooProjectPageComponent } from './components/yahoo-project-page/yahoo-project-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { YahooResultDisplayComponent } from './components/yahoo-result-display/yahoo-result-display.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { WoodworkingPageComponent } from './components/woodworking-page/woodworking-page.component';


registerLocaleData(en);

@NgModule({ declarations: [
        AppComponent,
        YahooProjectPageComponent,
        HomePageComponent,
        HeaderComponent,
        YahooResultDisplayComponent,
        AboutPageComponent,
        WoodworkingPageComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        AngularMaterialsModule,
        LayoutModule], providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
