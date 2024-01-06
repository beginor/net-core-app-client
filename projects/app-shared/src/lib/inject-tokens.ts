import { InjectionToken } from '@angular/core';

export const CONTEXT_ROOT = new InjectionToken<string>('contextRoot')
export const API_ROOT = new InjectionToken<string>('apiRoot');
export const IS_PRODUCTION = new InjectionToken<boolean>('isProduction');
