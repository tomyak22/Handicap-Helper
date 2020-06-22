import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandicapIndexComponent } from '../../app/handicap-index/handicap-index.component';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Round } from 'src/app/models/round.model';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('HandicapIndexComponent', () => {
  let component: HandicapIndexComponent;
  let fixture: ComponentFixture<HandicapIndexComponent>;
  let mockRoundsService: RoundsService;
  const mockRounds = require('../../assets/mock-data/mock20Rounds.json');
  let allMockRounds = [];
  let rounds: Round[];
  let mock5Rounds;
  let mock8Rounds;
  let mock11Rounds;
  let mock14Rounds;
  let mock16Rounds;
  let mock18Rounds;
  let mock19Rounds;
  let mock20Rounds;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandicapIndexComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ RoundsService, AuthService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mock5Rounds = mockRounds.filter(round => round.id <= 5);
    mock8Rounds = mockRounds.filter(round => round.id <= 8);
    mock11Rounds = mockRounds.filter(round => round.id <= 11);
    mock14Rounds = mockRounds.filter(round => round.id <= 14);
    mock16Rounds = mockRounds.filter(round => round.id <= 16);
    mock18Rounds = mockRounds.filter(round => round.id <= 18);
    mock19Rounds = mockRounds.filter(round => round.id <= 19);
    mock20Rounds = mockRounds.filter(round => round.id <= 20);
    fixture = TestBed.createComponent(HandicapIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    mockRoundsService = debugElement.injector.get(RoundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the correct handicap for 20 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock20Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(22.5);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 5 or less rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock5Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(16.3);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 6-8 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock8Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(18.1);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 9-11 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock11Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(20.0);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 12-14 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock14Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(20.5);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 15-16 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock16Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(21.2);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 17-18 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock18Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(21.7);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });

  it('should calculate the correct handicap for 19 rounds', () => {
    let mockRoundsServiceSpy = spyOn(mockRoundsService, 'getLatestTwentyRounds').and.returnValue(of(mock19Rounds));
    component.calculateHandicap().subscribe(handicap => {
      expect(handicap).toEqual(22.1);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });
});
