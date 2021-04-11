jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRoles, Roles } from '../roles.model';
import { RolesService } from '../service/roles.service';

import { RolesRoutingResolveService } from './roles-routing-resolve.service';

describe('Service Tests', () => {
  describe('Roles routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RolesRoutingResolveService;
    let service: RolesService;
    let resultRoles: IRoles | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RolesRoutingResolveService);
      service = TestBed.inject(RolesService);
      resultRoles = undefined;
    });

    describe('resolve', () => {
      it('should return IRoles returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRoles).toEqual({ id: 123 });
      });

      it('should return new IRoles if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoles = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRoles).toEqual(new Roles());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRoles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRoles).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
