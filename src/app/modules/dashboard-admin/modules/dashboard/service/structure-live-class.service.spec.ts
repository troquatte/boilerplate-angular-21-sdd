import { TestBed } from '@angular/core/testing';

import { StructureLiveClassService } from './structure-live-class.service';

describe('StructureLiveClassService', () => {
  let service: StructureLiveClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureLiveClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
