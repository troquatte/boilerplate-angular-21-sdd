import { TestBed } from '@angular/core/testing';

import { StructureTimelineDaysService } from './structure-timeline-days.service';

describe('StructureTimelineDaysService', () => {
  let service: StructureTimelineDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureTimelineDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
