import { TestBed, async } from '@angular/core/testing';

import { RoundsService } from '../../app/services/rounds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoundsService', () => {
  let service: RoundsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
