import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {AppComponent} from './app.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {PointDialogComponent} from './pages/map/point-dialog/point-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {UpdatePointNumbersPipe} from './core/pipes/update-point-numbers.pipe';
import {IncrementPipe} from './core/pipes/increment.pipe';
import {LocationsPipe} from './core/pipes/locations.pipe';
import {MatFormFieldModule} from "@angular/material/form-field";

@NgModule({
  declarations: [
    AppComponent,
    PointDialogComponent,
    UpdatePointNumbersPipe,
    IncrementPipe,
    LocationsPipe
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    LeafletDrawModule,
    RouterModule,
    RouterOutlet,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    UpdatePointNumbersPipe,
    IncrementPipe,
    LocationsPipe,
    MatDialog,
  ],
  exports: [
    RouterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
