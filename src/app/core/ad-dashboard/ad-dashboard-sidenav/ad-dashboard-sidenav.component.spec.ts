import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDashboardSideNavComponent } from './ad-dashboard-sidenav.component';

describe('AdDashboardSideNavComponent', () => {
  let component: AdDashboardSideNavComponent;
  let fixture: ComponentFixture<AdDashboardSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdDashboardSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDashboardSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
