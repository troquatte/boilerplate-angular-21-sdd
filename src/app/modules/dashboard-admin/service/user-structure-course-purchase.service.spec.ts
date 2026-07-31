import { TestBed } from '@angular/core/testing';

import { UserStructureCoursePurchaseService } from './user-structure-course-purchase.service';

describe('UserStructureCoursePurchaseService', () => {
  let service: UserStructureCoursePurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStructureCoursePurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
