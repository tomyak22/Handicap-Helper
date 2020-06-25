import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCreateComponent } from '../../app/round-create/round-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../test-assets/activated-route-stub';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Round } from 'src/app/models/round.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RoundCreateComponent', () => {
  let component: RoundCreateComponent;
  let fixture: ComponentFixture<RoundCreateComponent>;

  // Setup for a mock round
  const mockRounds = require('../../assets/mock-data/mock20Rounds.json');
  const mockRound: Round = {id: '1', score: 77, course: 'test course', rating: 77.1, slope: 123, date: 'test date', creator: 'whocares'};

  // Setup for service injections
  let debugElement: DebugElement;
  let mockActivatedRoute: ActivatedRouteStub;
  let mockRoundsService: RoundsService;
  let mockRoundsServiceSpy;
  let mockAddRoundsSpy;
  let mockUpdateRoundSpy;

  beforeEach(async(() => {
    mockActivatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ RoundCreateComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
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

  it('should fill the form with the mock round', () => {
    mockActivatedRoute.set('edit/:roundId', {roundId: mockRound.id});
    expect(mockRoundsServiceSpy).toHaveBeenCalled();
    expect(component.round.id).toEqual('1');
  });

  it('should be in create mode with no id in the param', () => {
    mockActivatedRoute.set('create');
    expect(component.mode).toBe('create');
  });

  it('should call add round when we are in create mode', () => {
    mockAddRoundsSpy = spyOn(mockRoundsService, 'addRound').and.callThrough();
    component.mode = 'create';
    component.round = {id: null, score: 77, course: 'test course', rating: 77.1, slope: 123, date: 'test date', creator: 'whocares'};
    component.form.controls['score'].setValue(component.round.score);
    component.form.controls['course'].setValue(component.round.course);
    component.form.controls['rating'].setValue(component.round.rating);
    component.form.controls['slope'].setValue(component.round.slope);
    component.form.controls['date'].setValue(component.round.date);
    component.onAddRound();
    expect(mockAddRoundsSpy).toHaveBeenCalled();
  });

  it('should call update round when we are in edit mode', () => {
    mockUpdateRoundSpy = spyOn(mockRoundsService, 'updateRound').and.callThrough();
    mockActivatedRoute.set('edit/:roundId', {roundId: mockRound.id});
    component.form.controls['score'].setValue(mockRound.score);
    component.form.controls['course'].setValue(mockRound.course);
    component.form.controls['rating'].setValue(mockRound.rating);
    component.form.controls['slope'].setValue(mockRound.slope);
    component.form.controls['date'].setValue(mockRound.date);
    component.onAddRound();
    expect(component.round.id).toBe(mockRound.id);
    expect(mockUpdateRoundSpy).toHaveBeenCalled();
  });

  it('should return return an invalid form', () => {
    component.mode = 'create';
    component.form.controls['score'].setValue(null);
    component.form.controls['course'].setValue(mockRound.course);
    component.form.controls['rating'].setValue(mockRound.rating);
    component.form.controls['slope'].setValue(mockRound.slope);
    component.form.controls['date'].setValue(mockRound.date);
    const invalidForm = component.form.invalid.valueOf();

    component.onAddRound();
    expect(invalidForm).toBe(true);
  });

  it('should open the round saved notification when saved', () => {
    const alertMessageSpy = spyOn(component.alertMessage, 'open');
    component.roundSavedMessage();
    expect(alertMessageSpy).toHaveBeenCalled();
  });
});
