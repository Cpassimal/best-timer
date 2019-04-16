import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChronometerComponent } from './chronometer/chronometer.component';
import { CountdownComponent } from './countdown/countdown.component';

import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    ChronometerComponent,
    CountdownComponent,
  ],
  imports: [
    BrowserModule,
    PipesModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
