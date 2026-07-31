import { TestBed } from '@angular/core/testing';

import { StructureImportantDataService } from './structure-important-dates.service';

describe('StructureImportantDataService', () => {
  let service: StructureImportantDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureImportantDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
