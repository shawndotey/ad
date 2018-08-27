import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDemoSidenavComponent } from './dashboard-demo-sidenav.component';

describe('DashboardDemoSidenavComponent', () => {
  let component: DashboardDemoSidenavComponent;
  let fixture: ComponentFixture<DashboardDemoSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDemoSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDemoSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
