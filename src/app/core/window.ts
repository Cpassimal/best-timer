import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const WINDOW = new InjectionToken('WindowToken');

export function windowFactory(platformId: string): any {
  if (isPlatformServer(platformId)) {
    return null;
  }

  return window;
}

export const WINDOW_PROVIDER = { provide: WINDOW, useFactory: windowFactory, deps: [PLATFORM_ID] };
