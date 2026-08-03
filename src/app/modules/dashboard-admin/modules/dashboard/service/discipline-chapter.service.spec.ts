import { TestBed } from '@angular/core/testing';

import { DisciplineChapterService } from './discipline-chapter.service';

describe('DisciplineChapterService', () => {
  let service: DisciplineChapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisciplineChapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
