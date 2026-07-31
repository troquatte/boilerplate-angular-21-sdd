import { TestBed } from '@angular/core/testing';

import { StructureSimulationsQuestionsService } from './structure-simulations-questions.service';

describe('StructureSimulationsQuestionsService', () => {
  let service: StructureSimulationsQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureSimulationsQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
