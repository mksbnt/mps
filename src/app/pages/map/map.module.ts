import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';
import {MapRouting} from "./map.routing";
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    MapRouting,
    LeafletModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    ClipboardModule,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    MatDialog,
  ],
})
export class MapModule {
}
