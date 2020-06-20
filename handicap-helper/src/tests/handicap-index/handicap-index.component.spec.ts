import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandicapIndexComponent } from '../../app/handicap-index/handicap-index.component';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Round } from 'src/app/models/round.model';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { doesNotReject } from 'assert';



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
    component.getHandicap().subscribe(handicap => {
      expect(handicap).toEqual(22.3);
    });
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
  });
});
