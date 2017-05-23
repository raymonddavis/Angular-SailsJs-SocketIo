import { TestBed, inject } from '@angular/core/testing';

import { RdService } from './rd.service';

describe('RdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RdService]
    });
  });

  it('should be created', inject([RdService], (service: RdService) => {
    expect(service).toBeTruthy();
  }));
});
