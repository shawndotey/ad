import { TestBed, inject } from '@angular/core/testing';

import { NotificationHttpService } from './notification.mock-http.service';

describe('NotificationHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationHttpService]
    });
  });

  it('should be created', inject([NotificationHttpService], (service: NotificationHttpService) => {
    expect(service).toBeTruthy();
  }));
});
