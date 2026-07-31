import { TestBed } from '@angular/core/testing';

import { StructureCoursesService } from './structure-courses.service';

describe('StructureCoursesService', () => {
  let service: StructureCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
