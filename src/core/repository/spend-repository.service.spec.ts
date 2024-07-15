import { TestBed } from '@angular/core/testing';

import { SpendRepositoryService } from './spend-repository.service';

describe('SpendRepositoryService', () => {
  let service: SpendRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpendRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
