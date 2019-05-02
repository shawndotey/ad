import { AppLayoutConfigurationOptions } from './model/AppLayoutConfigurationOptions.class';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLayoutConfigurationService {
  private _optionsValues = new AppLayoutConfigurationOptions();
  constructor() { }
}
