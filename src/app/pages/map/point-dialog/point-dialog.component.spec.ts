import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PointDialogComponent } from './point-dialog.component';
import { IPoint } from '../../../core/models/point.model';

describe('PointDialogComponent', () => {
  let component: PointDialogComponent;
  let fixture: ComponentFixture<PointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointDialogComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        FormBuilder
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDialogComponent);
    component = fixture.componentInstance;
    component.data = {
      number: 1,
      lat: 0,
      lng: 0,
      height: 0
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form controls', () => {
    expect(component.form.controls.number).toBeDefined();
    expect(component.form.controls.lat).toBeDefined();
    expect(component.form.controls.lng).toBeDefined();
    expect(component.form.controls.height).toBeDefined();
  });

  it('should bind the form controls to the data', () => {
    expect(component.form.controls.number.value).toBe(component.data.number);
    expect(component.form.controls.lat.value).toBe(component.data.lat);
    expect(component.form.controls.lng.value).toBe(component.data.lng);
    expect(component.form.controls.height.value).toBe(component.data.height);
  });

  it('should construct the point object correctly when the save button is clicked', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    spyOn(dialogRef, 'close');

    const button = fixture.nativeElement.querySelector('.actions button:last-child');
    button.dispatchEvent(new Event('click'));

    expect(dialogRef.close).toHaveBeenCalledWith(component.point);
  });
});
