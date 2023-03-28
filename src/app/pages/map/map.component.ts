import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {DivIconOptions, IconOptions, latLng, Map, Marker, tileLayer} from 'leaflet';
import 'leaflet-arrowheads';
import {PointsService} from "../../core/services/points.service";
import {IPoint} from "../../core/models/point.model";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {PointDialogComponent} from "../../core/dialogs/point-dialog/point-dialog.component";

@Component({
  selector: 'app-map', templateUrl: './map.component.html', styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  markers: Marker[] = [];
  leafletOptions = {
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})],
    zoom: 17,
    center: latLng(50.4851493, 30.4721233)
  };
  map!: Map;
  points!: IPoint[];

  constructor(private pointsService: PointsService, private dialog: MatDialog) {
  }

  get scrollHeight(): string {
    return `${document.body.scrollHeight}px`
  }

  ngOnInit(): void {
    this.pointsService.getPoints().pipe().subscribe(points => {
      this.points = points;
    })
  }

  onLeafletMapReady(map: Map): void {
    this.map = map;
    this.generateMarkers();
  }

  generateMarkers(): void {
    this.deleteAllPolylines();
    this.markers = [];
    const locations = this.convertPointsToLocations(this.points)

    this.points.forEach((point) => {
      const newMarker: L.Marker = this.createMarker(point.number, point.lat, point.lng).addTo(this.map);
      this.markers.push(newMarker);
    });

    this.createPolyline(locations, {color: 'red'}).addTo(this.map);
    this.markers.forEach((marker, index) => marker.on('dragend', () => this.onMarkerDragEnd(marker, index)))

    this.markers.forEach((marker, index) => marker.on('dblclick', () => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.points.find(point => point.number === this.getNumber(marker.options.icon?.options));
      this.dialog.open(PointDialogComponent, dialogConfig);
    }))
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
      number: this.points.length + 1, lat: 50.4851493, lng: 30.4721233, height: 100,
    };
    this.points.push(newPoint);
    const newMarker: L.Marker = this.createMarker(newPoint.number, newPoint.lat, newPoint.lng).addTo(this.map);
    this.markers.push(newMarker);
    const locations = this.convertPointsToLocations(this.points);
    this.deleteAllPolylines();
    this.createPolyline(locations, {color: 'red'}).addTo(this.map);
    this.markers.forEach((marker, index) => marker.on('dragend', () => this.onMarkerDragEnd(marker, index)))
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

  onMarkerDragEnd(marker: L.Marker, index: number): void {
    const locations = this.convertPointsToLocations(this.points);
    locations[index] = marker.getLatLng();
    this.points.map(point => {
      if (point.number === index + 1) {
        point.lat = marker.getLatLng().lat;
        point.lng = marker.getLatLng().lng
      }
    });
    this.deleteAllPolylines();
    this.createPolyline(locations, {color: 'red'}).addTo(this.map);
    this.markers.forEach((marker) => marker.off('dragend'));
    this.markers.forEach((marker, index) => marker.on('dragend', () => this.onMarkerDragEnd(marker, index)));
  }

  deletePoint(index: number): void {
    this.deleteAllPolylines();
    this.deleteAllMarkers();

    const markerToRemove = this.markers.splice(index, 1)[0];
    (markerToRemove as L.Marker).remove();
    this.points.splice(index, 1);

    this.points = this.orderPoints(this.points);

    this.markers = [];
    this.points.forEach((point) => {
      const newMarker: L.Marker = this.createMarker(point.number, point.lat, point.lng).addTo(this.map);
      this.markers.push(newMarker);
    });

    const locations = this.convertPointsToLocations(this.points);
    this.createPolyline(locations, {color: 'red'}).addTo(this.map);

    this.markers.forEach((marker) => marker.off('dragend'));
    this.markers.forEach((marker, index) => marker.on('dragend', () => this.onMarkerDragEnd(marker, index)));
  }

  orderPoints(points: IPoint[]) {
    return points.map((point, index) => {
      return {...point, number: index + 1};
    });
  }

  private getNumber(options: IconOptions | DivIconOptions | undefined): number {
    return Number(this.removeHtmlTags(Object(options).html));
  }

  removeHtmlTags(str: string): string {
    return str.replace(/(<([^>]+)>)/ig, "");
  }
}
