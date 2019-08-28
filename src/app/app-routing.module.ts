import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChronometerComponent } from './chronometer/chronometer.component';
import { CountdownComponent } from './countdown/countdown.component';
import { SeriesComponent } from './series/series.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chronometer',
  },
  {
    path: 'chronometer',
    component: ChronometerComponent,
  },
  {
    path: 'countdown',
    component: CountdownComponent,
  },
  {
    path: 'series',
    component: SeriesComponent,
  },
  {
    path: '**',
    redirectTo: 'chronometer',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule {
}
