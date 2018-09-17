import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSummaryCardComponent } from './ad-summary-card.component';

describe('AdSummaryCardComponent', () => {
  let component: AdSummaryCardComponent;
  let fixture: ComponentFixture<AdSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
