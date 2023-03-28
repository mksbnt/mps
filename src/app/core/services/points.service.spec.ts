import {TestBed} from '@angular/core/testing';
import {PointsService} from './points.service';
import {of} from 'rxjs';
import {IPoint} from '../models/point.model';

describe('PointsService', () => {
  let service: PointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PointsService]
    });
    service = TestBed.inject(PointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPoints', () => {
    it('should return an Observable of points', () => {
      const expectedPoints: IPoint[] = [
        {number: 1, lng: 100, lat: 100, height: 100},
        {number: 2, lng: 200, lat: 200, height: 200},
        {number: 3, lng: 300, lat: 300, height: 300},
      ];
      spyOn(service, 'getPoints').and.returnValue(of(expectedPoints));
      service.getPoints().subscribe((points) => {
        expect(points).toEqual(expectedPoints);
      });
    });
  });
});
