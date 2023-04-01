import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IPoint} from "../../../core/models/point.model";
import {NonNullableFormBuilder} from "@angular/forms";


@Component({
  selector: 'app-point-dialog',
  templateUrl: './point-dialog.component.html',
  styleUrls: ['./point-dialog.component.less']
})
export class PointDialogComponent implements OnInit {
  formBuilder = inject(NonNullableFormBuilder);
  form = this.formBuilder.group<IPoint>({
    number: this.data.number,
    lat: this.data.lat,
    lng: this.data.lng,
    height: this.data.height
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: IPoint) {
  }

  get point(): IPoint {
    return {
      number: this.data.number,
      lat: this.form.controls.lat.value,
      lng: this.form.controls.lng.value,
      height: this.form.controls.height.value
    }
  }

  ngOnInit(): void {
    this.form.controls.number.disable();
  }
}
