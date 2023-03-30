import {Component, NgZone, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {latLng, Map, Marker, tileLayer} from 'leaflet';
import 'leaflet-arrowheads';
import {PointsService} from "../../core/services/points.service";
import {IPoint} from "../../core/models/point.model";
import {MatDialog} from '@angular/material/dialog';
import {PointDialogComponent} from "./point-dialog/point-dialog.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-map', templateUrl: './map.component.html', styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  map!: Map;
  points$ = new BehaviorSubject<IPoint[]>([]);
  markers: Marker[] = [];
  leafletOptions = {
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})],
    zoom: 17,
    center: latLng(50.4851493, 30.4721233)
  };

  constructor(private zone: NgZone, private pointsService: PointsService, private dialog: MatDialog) {
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


  generateScheme(points: IPoint[]): void {
    this.eraseScheme();
    this.drawScheme(points);
    this.listenScheme();
  }

  eraseScheme(): void {
    this.deleteAllPolylines();
    this.deleteAllMarkers();
    this.markers = [];
  }

  listenScheme(): void {
    for (const [index, marker] of this.markers.entries()) {
      marker.off('dragend').on('dragend', () => this.onMarkerDragEnd(marker, index));
      marker.off('dblclick').on('dblclick', () => this.onMarkerDoubleClick(index));
    }
  }

  onMarkerDragEnd(marker: L.Marker, index: number): void {
    this.updatePointCoordinates(marker.getLatLng(), index);
  }

  onMarkerDoubleClick(index: number): void {
    const currentPoint = this.points$.value.find(point => point.number === index + 1);
    if (currentPoint) this.openDialog(currentPoint);
  }

  createPolyline(locations: L.LatLngExpression[], options: L.PolylineOptions): L.Polyline {
    const polyline = L.polyline(locations, options);
    polyline.arrowheads({
      yawn: 20, fill: true, offsets: {end: '10px'}
    });
    return polyline;
  }

  convertPointsToLocations(points: IPoint[]): { lat: number, lng: number }[] {
    return points.map(point => ({lat: point.lat, lng: point.lng}));
  }

  createMarker(serialNumber: number, lat: number, lng: number): L.Marker {
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

  addPoint(): void {
    const newPoint: IPoint = {
      number: this.points$.value.length + 1, lat: 50.4851493, lng: 30.4721233, height: 100,
    };

    const currentPoints = this.points$.value;
    currentPoints.push(newPoint);

    this.points$.next(currentPoints);
  }

  deleteAllPolylines(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        layer.remove();
      }
    });
  }

  deleteAllMarkers(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
  }

  updatePointCoordinates(newLatLng: L.LatLng, index: number): void {
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

  deletePoint(index: number): void {
    const points = this.points$.getValue() //.splice(index, 1);
    const deletedPoint = points.splice(index, 1)[0];

    for (let i = index; i < points.length; i++) {
      points[i].number = i + 1;
    }

    points.sort((a, b) => a.number - b.number);

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

  private drawScheme(points: IPoint[]): void {
    this.drawMarkers(points);
    this.drawPolylines(points);
  }

  private drawPolylines(points: IPoint[]): void {
    this.createPolyline(this.convertPointsToLocations(points), {color: 'red'}).addTo(this.map);
  }

  private drawMarkers(points: IPoint[]): void {
    this.markers = points.map((point) => {
      return this.createMarker(point.number, point.lat, point.lng).addTo(this.map);
    });
  }
}
