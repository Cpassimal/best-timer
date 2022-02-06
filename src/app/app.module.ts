import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WINDOW_PROVIDER } from './core/window';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChronometerComponent } from './chronometer/chronometer.component';
import { CountdownComponent } from './countdown/countdown.component';
import { SeriesComponent } from './series/series.component';
import { TimerComponent } from './timer/timer.component';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';

import { PipesModule } from './pipes/pipes.module';
import { PyramidComponent } from './pyramid/pyramid.component';

@NgModule({
  declarations: [
    ActionButtonsComponent,
    AppComponent,
    ChronometerComponent,
    CountdownComponent,
    NavbarComponent,
    PyramidComponent,
    SeriesComponent,
    TimerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    PipesModule,
    RouterModule,
  ],
  providers: [
    WINDOW_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
