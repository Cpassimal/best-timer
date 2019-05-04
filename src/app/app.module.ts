import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WINDOW_PROVIDER } from './core/window';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChronometerComponent } from './chronometer/chronometer.component';
import { CountdownComponent } from './countdown/countdown.component';
import { TimerComponent } from './timer/timer.component';

import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ChronometerComponent,
    CountdownComponent,
    TimerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PipesModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [
    WINDOW_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
