import { TestBed } from '@angular/core/testing';

import { RoundsService } from '../../app/services/rounds.service';

describe('RoundsService', () => {
  let service: RoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
