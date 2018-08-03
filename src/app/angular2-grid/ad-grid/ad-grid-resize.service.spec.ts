import { TestBed, inject } from '@angular/core/testing';

import { AdGridResizeService } from './ad-grid-resize.service';

describe('AdGridResizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdGridResizeService]
    });
  });

  it('should be created', inject([AdGridResizeService], (service: AdGridResizeService) => {
    expect(service).toBeTruthy();
  }));
});
