import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPanier, Panier } from '../panier.model';

import { PanierService } from './panier.service';

describe('Service Tests', () => {
  describe('Panier Service', () => {
    let service: PanierService;
    let httpMock: HttpTestingController;
    let elemDefault: IPanier;
    let expectedResult: IPanier | IPanier[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PanierService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        nbElements: 0,
        price: 0,
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

      it('should create a Panier', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Panier()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Panier', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            nbElements: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Panier', () => {
        const patchObject = Object.assign(
          {
            price: 1,
          },
          new Panier()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Panier', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            nbElements: 1,
            price: 1,
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

      it('should delete a Panier', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPanierToCollectionIfMissing', () => {
        it('should add a Panier to an empty array', () => {
          const panier: IPanier = { id: 'ABC' };
          expectedResult = service.addPanierToCollectionIfMissing([], panier);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(panier);
        });

        it('should not add a Panier to an array that contains it', () => {
          const panier: IPanier = { id: 'ABC' };
          const panierCollection: IPanier[] = [
            {
              ...panier,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addPanierToCollectionIfMissing(panierCollection, panier);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Panier to an array that doesn't contain it", () => {
          const panier: IPanier = { id: 'ABC' };
          const panierCollection: IPanier[] = [{ id: 'CBA' }];
          expectedResult = service.addPanierToCollectionIfMissing(panierCollection, panier);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(panier);
        });

        it('should add only unique Panier to an array', () => {
          const panierArray: IPanier[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Rustic' }];
          const panierCollection: IPanier[] = [{ id: 'ABC' }];
          expectedResult = service.addPanierToCollectionIfMissing(panierCollection, ...panierArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const panier: IPanier = { id: 'ABC' };
          const panier2: IPanier = { id: 'CBA' };
          expectedResult = service.addPanierToCollectionIfMissing([], panier, panier2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(panier);
          expect(expectedResult).toContain(panier2);
        });

        it('should accept null and undefined values', () => {
          const panier: IPanier = { id: 'ABC' };
          expectedResult = service.addPanierToCollectionIfMissing([], null, panier, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(panier);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
