import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdGridPlaceholderComponent } from './ad-grid-placeholder.component';

describe('AdGridPlaceholderComponent', () => {
  let component: AdGridPlaceholderComponent;
  let fixture: ComponentFixture<AdGridPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdGridPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdGridPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
