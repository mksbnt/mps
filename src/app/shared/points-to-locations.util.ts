import {IPoint} from "../core/models/point.model";

export function convertPointsToLocations(points: IPoint[]): { lat: number, lng: number }[] {
  return points.map(point => ({lat: point.lat, lng: point.lng}));
}
