import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCreateComponent } from './round-create.component';

describe('RoundCreateComponent', () => {
  let component: RoundCreateComponent;
  let fixture: ComponentFixture<RoundCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundCreateComponent ]
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
