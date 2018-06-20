import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdNavMenuComponent } from './ad-nav-menu.component';

describe('AdDashboardSidenavMenuComponent', () => {
  let component: AdNavMenuComponent;
  let fixture: ComponentFixture<AdNavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdNavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
