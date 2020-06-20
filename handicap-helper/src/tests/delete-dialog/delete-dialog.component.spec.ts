import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogComponent } from '../../app/delete-dialog/delete-dialog.component';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  const mockMatDialogRef = {
    close: jasmine.createSpy('close')
   };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDialogComponent ],
      imports: [ MatDialogModule ],
      providers: [ {
        provide: MatDialogRef,
        useValue: mockMatDialogRef
      } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialogRef when the user confirms delete', () => {
    component.confirmDelete();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialogRef when the user cancels delete', () => {
    component.cancelDelete();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});
