import { NgModule } from '@angular/core';

import { TimeFormatPipe } from './time-format.pipe';

@NgModule({
  declarations: [
    TimeFormatPipe,
  ],
  exports: [
    TimeFormatPipe,
  ],
  providers: [
    TimeFormatPipe,
  ],
})
export class PipesModule {
}
