import { TestBed } from '@angular/core/testing';

import { IconsSanitizerService } from './icons-sanitizer.service';

describe('IconsSanitizerService', () => {
  let service: IconsSanitizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconsSanitizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
