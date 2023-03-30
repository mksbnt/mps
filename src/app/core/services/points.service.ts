import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {IPoint} from "../models/point.model";

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private points: IPoint[] = [
    {number: 1, lat: 50.486375, lng: 30.469851, height: 100},
    {number: 2, lat: 50.487071, lng: 30.470656, height: 100},
    {number: 3, lat: 50.486108, lng: 30.472308, height: 100},
    {number: 4, lat: 50.486508, lng: 30.472308, height: 100},
  ];

  getPoints(): Observable<IPoint[]> {
    return of(this.points);
  }

  postPoints(points: IPoint[]) {
    console.log(points)
  }
}
