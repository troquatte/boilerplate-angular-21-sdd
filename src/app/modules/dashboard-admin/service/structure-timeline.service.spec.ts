import { TestBed } from '@angular/core/testing';

import { StructureTimelineService } from './structure-timeline.service';

describe('StructureTimelineService', () => {
  let service: StructureTimelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureTimelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
