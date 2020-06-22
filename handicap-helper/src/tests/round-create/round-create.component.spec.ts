import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCreateComponent } from '../../app/round-create/round-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoundsService } from 'src/app/services/rounds.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('RoundCreateComponent', () => {
  let component: RoundCreateComponent;
  let fixture: ComponentFixture<RoundCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundCreateComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, MatSnackBarModule ],
      providers: [ RoundsService, AuthService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
