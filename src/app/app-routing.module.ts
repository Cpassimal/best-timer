import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChronometerComponent } from './chronometer/chronometer.component';
import { CountdownComponent } from './countdown/countdown.component';
import { PyramidComponent } from './pyramid/pyramid.component';

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
    path: 'pyramid',
    component: PyramidComponent,
  },
  {
    path: '**',
    redirectTo: 'chronometer',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
})
export class AppRoutingModule {
}
