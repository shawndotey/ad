import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDashboardSideNavComponent } from './dashboard-sidenav.component';

describe('AppDashboardSideNavComponent', () => {
  let component: AppDashboardSideNavComponent;
  let fixture: ComponentFixture<AppDashboardSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDashboardSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDashboardSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
