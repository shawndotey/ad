import { TestBed, inject } from '@angular/core/testing';

import { AdNavMenuService } from './ad-nav-menu.service';

describe('AdDashboardSidenavMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdNavMenuService]
    });
  });

  it('should be created', inject([AdNavMenuService], (service: AdNavMenuService) => {
    expect(service).toBeTruthy();
  }));
});
