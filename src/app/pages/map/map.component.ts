import {Component, NgZone, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {latLng, Map, Marker, tileLayer} from 'leaflet';
import 'leaflet-arrowheads';
import {PointsService} from "../../core/services/points.service";
import {IPoint} from "../../core/models/point.model";
import {MatDialog} from '@angular/material/dialog';
import {PointDialogComponent} from "./point-dialog/point-dialog.component";
import {BehaviorSubject} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {UpdatePointNumbersPipe} from "../../core/pipes/update-point-numbers.pipe";
import {IncrementPipe} from "../../core/pipes/increment.pipe";
import {LocationsPipe} from "../../core/pipes/locations.pipe";

@Component({
  selector: 'app-map', templateUrl: './map.component.html', styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  isGrabbing: boolean = false;
  isAsideOpened: boolean = false;
  map!: Map;
  points$ = new BehaviorSubject<IPoint[]>([]);
  markers: Marker[] = [];
  leafletOptions = {
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})],
    zoom: 17,
    center: latLng(50.4851493, 30.4721233)
  };

  constructor(private zone: NgZone, private pointsService: PointsService, private dialog: MatDialog, private orderPipe: UpdatePointNumbersPipe, private incrementPipe: IncrementPipe, private locationsPipe: LocationsPipe,) {
  }

  get scrollHeight(): string {
    return `${document.body.scrollHeight}px`
  }

  ngOnInit(): void {
    this.pointsService.getPoints().pipe().subscribe(points => {
      this.points$.next(points);
    })
  }

  onLeafletMapReady(map: Map): void {
    this.map = map;
    this.points$.subscribe(points => {
      this.generateScheme(points);
      this.pointsService.postPoints(points);
    });
  }

  addPoint(): void {
    const newPoint: IPoint = {
      number: this.incrementPipe.transform(this.points$.getValue().length),
      lat: this.map.getCenter().lat,
      lng: this.map.getCenter().lng,
      height: 0,
    };
    this.points$.next([...this.points$.value, newPoint]);
  }

  deletePoint(index: number): void {
    const points = [...this.points$.value];
    points.splice(index, 1);

    for (let i = index; i < points.length; i++) {
      points[i].number = this.incrementPipe.transform(i);
    }

    this.points$.next(points.sort((a, b) => a.number - b.number));
  }

  drop(event: CdkDragDrop<IPoint[]>): void {
    const points = this.points$.getValue();
    if (event.previousContainer === event.container) {
      moveItemInArray(points, event.previousIndex, event.currentIndex);
    } else {
      const movedPoint = points.splice(event.previousIndex, 1)[0];
      points.splice(event.currentIndex, 0, movedPoint);
    }

    this.points$.next(this.orderPipe.transform(points));
    this.isGrabbing = false;
  }

  openDialog(point: IPoint): void {
    this.zone.run(() => {
      const dialogRef = this.dialog.open(PointDialogComponent, {data: point})

      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          const points = this.points$.value.slice();
          points.forEach(point => {
            if (point.number === result.number) {
              point.lat = result.lat;
              point.lng = result.lng;
              point.height = result.height;
            }
          })

          this.points$.next(points);
        }
      });
    });
  }

  toggleAside(): void {
    this.isAsideOpened = !this.isAsideOpened;
  }

  mouseDown(): void {
    this.isGrabbing = true;
  }

  mouseUp(): void {
    this.isGrabbing = false;
  }

  private generateScheme(points: IPoint[]): void {
    this.eraseScheme();
    this.drawScheme(points);
    this.listenScheme();
  }

  private eraseScheme(): void {
    this.deleteAllPolylines();
    this.deleteAllMarkers();
  }

  private listenScheme(): void {
    for (const [index, marker] of this.markers.entries()) {
      marker.off('dragend').on('dragend', () => this.onMarkerDragEnd(marker, index));
      marker.off('dblclick').on('dblclick', () => this.onMarkerDoubleClick(index));
    }
  }

  private onMarkerDragEnd(marker: L.Marker, index: number): void {
    this.updatePointCoordinates(marker.getLatLng(), index);
  }

  private onMarkerDoubleClick(index: number): void {
    const currentPoint = this.points$.value.find(point => point.number === this.incrementPipe.transform(index));
    if (currentPoint) this.openDialog(currentPoint);
  }

  private drawPolyline(locations: L.LatLngExpression[], options: L.PolylineOptions): L.Polyline {
    const polyline = L.polyline(locations, options);
    polyline.arrowheads({
      yawn: 13, fill: true, offsets: {end: '10px'}
    });
    return polyline;
  }

  private drawMarker(serialNumber: number, lat: number, lng: number): L.Marker {
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.innerText = String(serialNumber);

    const icon = L.divIcon({
      html: markerElement.outerHTML, className: 'marker-icon',
    });

    return L.marker([lat, lng], {
      icon, draggable: true
    });
  }

  private deleteAllPolylines(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        layer.remove();
      }
    });
  }

  private deleteAllMarkers(): void {
    this.markers = [];
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
  }

  private updatePointCoordinates(newLatLng: L.LatLng, index: number): void {
    const pointToUpdate = this.points$.value.find(point => point.number === this.incrementPipe.transform(index));
    if (!pointToUpdate) {
      return;
    }

    const updatedPoint = {
      ...pointToUpdate, lat: newLatLng.lat, lng: newLatLng.lng,
    };

    const updatedPoints = this.points$.value.map(point => {
      if (point.number === this.incrementPipe.transform(index)) {
        return updatedPoint;
      }
      return point;
    });

    this.points$.next(updatedPoints);
  }

  private drawScheme(points: IPoint[]): void {
    this.drawMarkers(points);
    this.drawPolylines(points);
  }

  private drawPolylines(points: IPoint[]): void {
    this.drawPolyline(this.locationsPipe.transform(points), {color: 'red'}).addTo(this.map);
  }

  private drawMarkers(points: IPoint[]): void {
    this.markers = points.map((point) => {
      return this.drawMarker(point.number, point.lat, point.lng).addTo(this.map);
    });
  }
}
