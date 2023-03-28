import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IPoint} from "../../models/point.model";

@Component({
  selector: 'app-point-dialog',
  templateUrl: './point-dialog.component.html',
  styleUrls: ['./point-dialog.component.less']
})
export class PointDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IPoint) {
    console.log(data);
  }
}
