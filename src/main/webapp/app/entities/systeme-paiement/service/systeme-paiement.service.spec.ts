import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISystemePaiement, SystemePaiement } from '../systeme-paiement.model';

import { SystemePaiementService } from './systeme-paiement.service';

describe('Service Tests', () => {
  describe('SystemePaiement Service', () => {
    let service: SystemePaiementService;
    let httpMock: HttpTestingController;
    let elemDefault: ISystemePaiement;
    let expectedResult: ISystemePaiement | ISystemePaiement[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SystemePaiementService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        method: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SystemePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SystemePaiement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SystemePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            method: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SystemePaiement', () => {
        const patchObject = Object.assign(
          {
            method: 'BBBBBB',
          },
          new SystemePaiement()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SystemePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            method: 'BBBBBB',
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

      it('should delete a SystemePaiement', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSystemePaiementToCollectionIfMissing', () => {
        it('should add a SystemePaiement to an empty array', () => {
          const systemePaiement: ISystemePaiement = { id: 123 };
          expectedResult = service.addSystemePaiementToCollectionIfMissing([], systemePaiement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(systemePaiement);
        });

        it('should not add a SystemePaiement to an array that contains it', () => {
          const systemePaiement: ISystemePaiement = { id: 123 };
          const systemePaiementCollection: ISystemePaiement[] = [
            {
              ...systemePaiement,
            },
            { id: 456 },
          ];
          expectedResult = service.addSystemePaiementToCollectionIfMissing(systemePaiementCollection, systemePaiement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SystemePaiement to an array that doesn't contain it", () => {
          const systemePaiement: ISystemePaiement = { id: 123 };
          const systemePaiementCollection: ISystemePaiement[] = [{ id: 456 }];
          expectedResult = service.addSystemePaiementToCollectionIfMissing(systemePaiementCollection, systemePaiement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(systemePaiement);
        });

        it('should add only unique SystemePaiement to an array', () => {
          const systemePaiementArray: ISystemePaiement[] = [{ id: 123 }, { id: 456 }, { id: 99533 }];
          const systemePaiementCollection: ISystemePaiement[] = [{ id: 123 }];
          expectedResult = service.addSystemePaiementToCollectionIfMissing(systemePaiementCollection, ...systemePaiementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const systemePaiement: ISystemePaiement = { id: 123 };
          const systemePaiement2: ISystemePaiement = { id: 456 };
          expectedResult = service.addSystemePaiementToCollectionIfMissing([], systemePaiement, systemePaiement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(systemePaiement);
          expect(expectedResult).toContain(systemePaiement2);
        });

        it('should accept null and undefined values', () => {
          const systemePaiement: ISystemePaiement = { id: 123 };
          expectedResult = service.addSystemePaiementToCollectionIfMissing([], null, systemePaiement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(systemePaiement);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
