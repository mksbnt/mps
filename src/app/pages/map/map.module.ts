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
    // MatDialog,
  ],
  // providers: [
  //   MatDialog,
  // ],
})
export class MapModule {
}
