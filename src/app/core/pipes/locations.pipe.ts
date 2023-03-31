import { Pipe, PipeTransform } from '@angular/core';
import {ILocation, IPoint} from "../models/point.model";

@Pipe({
  name: 'locations'
})
export class LocationsPipe implements PipeTransform {

  transform(value: IPoint[]): ILocation[] {
    return value.map(point => ({lat: point.lat, lng: point.lng}));
  }

}
