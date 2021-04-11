import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRestaurant, Restaurant } from '../restaurant.model';

import { RestaurantService } from './restaurant.service';

describe('Service Tests', () => {
  describe('Restaurant Service', () => {
    let service: RestaurantService;
    let httpMock: HttpTestingController;
    let elemDefault: IRestaurant;
    let expectedResult: IRestaurant | IRestaurant[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RestaurantService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
        adress: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Restaurant()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            adress: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Restaurant', () => {
        const patchObject = Object.assign({}, new Restaurant());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            adress: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Restaurant', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRestaurantToCollectionIfMissing', () => {
        it('should add a Restaurant to an empty array', () => {
          const restaurant: IRestaurant = { id: 'ABC' };
          expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurant);
        });

        it('should not add a Restaurant to an array that contains it', () => {
          const restaurant: IRestaurant = { id: 'ABC' };
          const restaurantCollection: IRestaurant[] = [
            {
              ...restaurant,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Restaurant to an array that doesn't contain it", () => {
          const restaurant: IRestaurant = { id: 'ABC' };
          const restaurantCollection: IRestaurant[] = [{ id: 'CBA' }];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurant);
        });

        it('should add only unique Restaurant to an array', () => {
          const restaurantArray: IRestaurant[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Refined projecti' }];
          const restaurantCollection: IRestaurant[] = [{ id: 'ABC' }];
          expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, ...restaurantArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const restaurant: IRestaurant = { id: 'ABC' };
          const restaurant2: IRestaurant = { id: 'CBA' };
          expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant, restaurant2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(restaurant);
          expect(expectedResult).toContain(restaurant2);
        });

        it('should accept null and undefined values', () => {
          const restaurant: IRestaurant = { id: 'ABC' };
          expectedResult = service.addRestaurantToCollectionIfMissing([], null, restaurant, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(restaurant);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
