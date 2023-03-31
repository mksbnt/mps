import { Pipe, PipeTransform } from '@angular/core';
import {IPoint} from "../models/point.model";

@Pipe({
  name: 'updatePointNumbers'
})
export class UpdatePointNumbersPipe implements PipeTransform {

  transform(value: IPoint[]): IPoint[] {
    return value.map((point, index): IPoint => ({
      ...point,
      number: index + 1,
    }));
  }
}
