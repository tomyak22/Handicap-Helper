import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { RoundListComponent } from '../../app/round-list/round-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DebugElement } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RoundListComponent', () => {
  let component: RoundListComponent;
  let fixture: ComponentFixture<RoundListComponent>;
  const mockRounds = require('../../assets/mock-data/mock20Rounds.json');
  let allMockRounds;
  let mockRoundsService: RoundsService;
  let mockAuthService: AuthService;
  let debugElement: DebugElement;
  let mockPageData: PageEvent;
  let mockRoundsData;
  let updateListenerSpy;
  let authSpy;
  let authIdSpy;
  let isAuthenticated = true;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundListComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatPaginatorModule
      ],
      providers: [ RoundsService, AuthService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    allMockRounds = mockRounds.filter(round => round.id <= 20);
    mockRoundsData = {rounds: allMockRounds, roundsCount: allMockRounds.length};
    mockPageData = {pageIndex: 1, pageSize: 10, length: 40};
    fixture = TestBed.createComponent(RoundListComponent);
    debugElement = fixture.debugElement;
    mockRoundsService = debugElement.injector.get(RoundsService);
    mockAuthService = debugElement.injector.get(AuthService);
    updateListenerSpy = spyOn(mockRoundsService, 'getRoundsUpdateListener').and.returnValue(of(mockRoundsData));
    authSpy = spyOn(mockAuthService, 'getAuthStatusListener').and.returnValue(of(true));
    authIdSpy = spyOn(mockAuthService, 'getUserId').and.returnValue('1');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the getRoundsUpdateListener to return total rounds and length', () => {
    expect(updateListenerSpy).toHaveBeenCalled();
    component.roundsService.getRoundsUpdateListener().subscribe(mockRoundsData => {
      expect(component.isLoading).toBe(false);
      expect(component.totalRounds).toBe(mockRoundsData.rounds.length);
      expect(component.rounds).toBe(mockRoundsData.rounds);
    });
  });

  it('should check to see if the user is authenticated when page loads', () => {
    expect(authSpy).toHaveBeenCalled();
    expect(authIdSpy).toHaveBeenCalled();
    expect(component.userIsAuthenticated).toBe(true);
    expect(component.userId).toBe('1');
  });

  it('should update the page data when onChangedPage is called', () => {
    const getRoundsSpy = spyOn(mockRoundsService, 'getRounds');
    component.onChangedPage(mockPageData);
    expect(component.isLoading).toBe(true);
    expect(component.currentPage).toBe(2);
    expect(component.roundsPerPage).toBe(10);
    expect(getRoundsSpy).toHaveBeenCalledWith(10, 2);
  });

  it('should call delete round from the service when onDelete is called', fakeAsync(() => {
    const getRoundsSpy = spyOn(mockRoundsService, 'getRounds');
    component.rounds = allMockRounds;
    let length = component.rounds.length;
    const deleteSpy = spyOn(mockRoundsService, 'deleteRound').and.returnValue(of({}));
    component.onDelete(component.rounds[0].id);
    tick();
    fixture.detectChanges();
    tick(300);
    expect(deleteSpy).toHaveBeenCalled();
    expect(component.totalRounds).toBe(length - 1);
    expect(getRoundsSpy).toHaveBeenCalled();
  }));
});
