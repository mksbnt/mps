import {Component, NgZone, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {latLng, Map, Marker, tileLayer} from 'leaflet';
import 'leaflet-arrowheads';
import {PointsService} from "../../core/services/points.service";
import {IPoint} from "../../core/models/point.model";
import {MatDialog} from '@angular/material/dialog';
import {PointDialogComponent} from "./point-dialog/point-dialog.component";
import {BehaviorSubject} from "rxjs";
import {convertPointsToLocations} from "../../shared/points-to-locations.util";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

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

  constructor(
    private zone: NgZone,
    private pointsService: PointsService,
    private dialog: MatDialog,
  ) {
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
      number: this.points$.value.length + 1, lat: 50.4851493, lng: 30.4721233, height: 100,
    };

    const currentPoints = this.points$.value;
    currentPoints.push(newPoint);

    this.points$.next(currentPoints);
  }

  deletePoint(index: number): void {
    const points = this.points$.getValue();
    const deletedPoint = points.splice(index, 1)[0];

    for (let i = index; i < points.length; i++) {
      points[i].number = i + 1;
    }

    points.sort((a, b) => a.number - b.number);

    this.points$.next(points);
  }

  drop(event: CdkDragDrop<IPoint[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const points = this.points$.getValue();
    points.forEach((point, index) => {
      point.number = index + 1;
    });

    this.isGrabbing = false;
    this.points$.next(points);
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

  mouseDown() {
    this.isGrabbing = true;
  }

  mouseUp() {
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
    const currentPoint = this.points$.value.find(point => point.number === index + 1);
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
    const pointToUpdate = this.points$.value.find(point => point.number === index + 1);
    if (!pointToUpdate) {
      return;
    }

    const updatedPoint = {
      ...pointToUpdate, lat: newLatLng.lat, lng: newLatLng.lng,
    };

    const updatedPoints = this.points$.value.map(point => {
      if (point.number === index + 1) {
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
    this.drawPolyline(convertPointsToLocations(points), {color: 'red'}).addTo(this.map);
  }

  private drawMarkers(points: IPoint[]): void {
    this.markers = points.map((point) => {
      return this.drawMarker(point.number, point.lat, point.lng).addTo(this.map);
    });
  }
}
