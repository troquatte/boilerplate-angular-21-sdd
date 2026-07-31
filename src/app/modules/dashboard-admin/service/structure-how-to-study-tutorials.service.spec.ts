import { TestBed } from '@angular/core/testing';

import { StructureHowToStudyTutorialsService } from './structure-how-to-study-tutorials.service';

describe('StructureHowToStudyTutorialsService', () => {
  let service: StructureHowToStudyTutorialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureHowToStudyTutorialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
