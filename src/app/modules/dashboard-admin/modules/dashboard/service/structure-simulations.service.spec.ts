import { TestBed } from '@angular/core/testing';

import { StructureSimulationsService } from './structure-simulations.service';

describe('StructureSimulationsService', () => {
  let service: StructureSimulationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureSimulationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
