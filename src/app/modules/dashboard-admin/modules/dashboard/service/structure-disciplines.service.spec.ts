import { TestBed } from '@angular/core/testing';

import { StructureDisciplinesService } from './structure-disciplines.service';

describe('StructureDisciplinesService', () => {
  let service: StructureDisciplinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureDisciplinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
