import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGridPlaceholderComponent } from './ng-grid-placeholder.component';

describe('NgGridPlaceholderComponent', () => {
  let component: NgGridPlaceholderComponent;
  let fixture: ComponentFixture<NgGridPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgGridPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgGridPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
