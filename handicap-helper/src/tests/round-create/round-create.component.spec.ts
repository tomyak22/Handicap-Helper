import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCreateComponent } from '../../app/round-create/round-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../test-assets/activated-route-stub';
import { of } from 'rxjs';

describe('RoundCreateComponent', () => {
  let component: RoundCreateComponent;
  let fixture: ComponentFixture<RoundCreateComponent>;

  // Setup for a mock round
  const mockRounds = require('../../assets/mock-data/mock20Rounds.json');
  const mockRound = mockRounds.filter(round => round.id === 1);

  // Setup for service injections
  let debugElement: DebugElement;
  let mockActivatedRoute: ActivatedRouteStub;
  let mockRoundsService: RoundsService;
  let mockRoundsServiceSpy;

  beforeEach(async(() => {
    mockActivatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ RoundCreateComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule
      ],
      providers: [ RoundsService, AuthService,
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundCreateComponent);
    debugElement = fixture.debugElement;
    mockRoundsService = debugElement.injector.get(RoundsService);
    mockRoundsServiceSpy = spyOn(mockRoundsService, 'getRound').and.returnValue(of(mockRound));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fill the form with the mock round', () => {
    mockActivatedRoute.set('edit/:roundId', {roundId: mockRound.id});
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
    expect(component.round.id).toBe(mockRound.id);
  });

  it('should be in create mode with no id in the param', () => {
    mockActivatedRoute.set('create');
    expect(component.mode).toBe('create');
  });
});
