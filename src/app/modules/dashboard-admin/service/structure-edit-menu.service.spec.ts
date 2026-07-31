import { TestBed } from '@angular/core/testing';

import { StructureEditMenuService } from './structure-edit-menu.service';

describe('StructureEditMenuService', () => {
  let service: StructureEditMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureEditMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
