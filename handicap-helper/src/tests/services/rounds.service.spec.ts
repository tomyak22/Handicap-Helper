import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';

import { RoundsService } from '../../app/services/rounds.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Round } from 'src/app/models/round.model';
import { HttpClient } from '@angular/common/http';

describe('RoundsService', () => {
  let service: RoundsService;
  let mockRounds: Round[] = [];
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let createdRound: Round;

  beforeEach(async(() => {
    mockRounds = require('../../assets/mock-data/mockDbRounds.json');
    createdRound = {id: null, score: 100, course: 'NewCourse', rating: 72, slope: 123, date: '2020-01-01', creator: null};
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(RoundsService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all the rounds from the json', fakeAsync(() => {
    const mockRoundsPerPage = 20;
    const mockCurrentPage = 1;
    const queryParams = `?pagesize=${mockRoundsPerPage}&page=${mockCurrentPage}`;
    let roundCount;
    let retrievedRounds: Round[] = null;
    service.getRoundsUpdateListener().subscribe(data => {
      retrievedRounds = data.rounds;
      roundCount = data.roundsCount;
    });
    service.getRounds(mockRoundsPerPage, mockCurrentPage);

    const req = httpTestingController.expectOne('http://localhost:3000/api/rounds' + queryParams);
    expect(req.request.method).toEqual('GET');

    expect(retrievedRounds).toBeNull();
    req.flush({message: 'This is working', rounds: mockRounds, nRounds: 20});
    httpTestingController.verify();

    expect(retrievedRounds[0].course).toBe(mockRounds[0].course);
  }));

  it('should return a round with a specific id', fakeAsync(() => {
    let mockRound = mockRounds[0];
    let round: Round;
    const testId = '1';
    service.getRound(testId).subscribe(data => round = data);

    const req = httpTestingController.expectOne('http://localhost:3000/api/rounds/' + `${testId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockRound);
    httpTestingController.verify();

    expect(round.id).toBe('1');
    expect(round.course).toBe('St James Member\'s Club (Cate)');
    expect(round.creator).toBe('TestUser');
  }));

  //make mock rounds array
  //service.method.subscribe
  //const req = httpTestingController.expectone(URL)
  //expect(rea.request.method).to equal Get
  //req.flush(mockRound[])
  //httpTestingController.verify
  //tick
  //expects

  //create or update
  //should, inject([RoundsService]), fakeAsync((service: RoundsService))
});
