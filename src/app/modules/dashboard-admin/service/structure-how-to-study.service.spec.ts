import { TestBed } from '@angular/core/testing';

import { StructureHowToStudyService } from './structure-how-to-study.service';

describe('StructureHowToStudyService', () => {
  let service: StructureHowToStudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureHowToStudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
