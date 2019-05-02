import { TestBed } from '@angular/core/testing';

import { AppLayoutConfigurationService } from './app-layout-configuration.service';

describe('LayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLayoutConfigurationService = TestBed.get(AppLayoutConfigurationService);
    expect(service).toBeTruthy();
  });
});
