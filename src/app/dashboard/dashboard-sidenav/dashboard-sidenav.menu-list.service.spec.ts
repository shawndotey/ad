import { TestBed, inject } from '@angular/core/testing';

import { DashboardSidenav.MenuListService } from './dashboard-sidenav.menu-list.service';

describe('DashboardSidenav.MenuListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardSidenav.MenuListService]
    });
  });

  it('should be created', inject([DashboardSidenav.MenuListService], (service: DashboardSidenav.MenuListService) => {
    expect(service).toBeTruthy();
  }));
});
