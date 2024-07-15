import { TestBed } from '@angular/core/testing';

import { SpendMapperService } from './spend-mapper.service';

describe('SpendMapperService', () => {
  let service: SpendMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpendMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
