import { TestBed } from '@angular/core/testing';

import { DCadleService } from './dcadle.service';

describe('DCadleService', () => {
  let service: DCadleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DCadleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
