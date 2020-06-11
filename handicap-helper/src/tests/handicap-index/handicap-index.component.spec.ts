import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandicapIndexComponent } from '../../app/handicap-index/handicap-index.component';

describe('HandicapIndexComponent', () => {
  let component: HandicapIndexComponent;
  let fixture: ComponentFixture<HandicapIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandicapIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandicapIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
