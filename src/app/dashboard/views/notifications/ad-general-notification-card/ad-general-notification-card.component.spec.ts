import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdGeneralNotificationCardComponent } from './ad-general-notification-card.component';

describe('AdGeneralNotificationCardComponent', () => {
  let component: AdGeneralNotificationCardComponent;
  let fixture: ComponentFixture<AdGeneralNotificationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdGeneralNotificationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdGeneralNotificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
