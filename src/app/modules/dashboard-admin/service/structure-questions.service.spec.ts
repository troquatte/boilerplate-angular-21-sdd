import { TestBed } from '@angular/core/testing';

import { StructureQuestionsService } from './structure-questions.service';

describe('StructureQuestionsService', () => {
  let service: StructureQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
