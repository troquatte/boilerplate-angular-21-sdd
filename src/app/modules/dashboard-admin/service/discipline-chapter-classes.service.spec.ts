import { TestBed } from '@angular/core/testing';

import { DisciplineChapterClassesService } from './discipline-chapter-classes.service';

describe('DisciplineChapterClassesService', () => {
  let service: DisciplineChapterClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisciplineChapterClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
