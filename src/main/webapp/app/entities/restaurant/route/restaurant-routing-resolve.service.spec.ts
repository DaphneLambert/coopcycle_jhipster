jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRestaurant, Restaurant } from '../restaurant.model';
import { RestaurantService } from '../service/restaurant.service';

import { RestaurantRoutingResolveService } from './restaurant-routing-resolve.service';

describe('Service Tests', () => {
  describe('Restaurant routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RestaurantRoutingResolveService;
    let service: RestaurantService;
    let resultRestaurant: IRestaurant | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RestaurantRoutingResolveService);
      service = TestBed.inject(RestaurantService);
      resultRestaurant = undefined;
    });

    describe('resolve', () => {
      it('should return IRestaurant returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultRestaurant).toEqual({ id: 'ABC' });
      });

      it('should return new IRestaurant if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurant = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRestaurant).toEqual(new Restaurant());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRestaurant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultRestaurant).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
