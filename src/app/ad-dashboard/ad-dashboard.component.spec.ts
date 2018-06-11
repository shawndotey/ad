
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ADDashboardComponent } from './ad-dashboard.component';

describe('DashboardComponent', () => {
  let component: ADDashboardComponent;
  let fixture: ComponentFixture<ADDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ADDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
