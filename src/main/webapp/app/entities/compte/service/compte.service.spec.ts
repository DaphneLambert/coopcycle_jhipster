import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompte, Compte } from '../compte.model';

import { CompteService } from './compte.service';

describe('Service Tests', () => {
  describe('Compte Service', () => {
    let service: CompteService;
    let httpMock: HttpTestingController;
    let elemDefault: ICompte;
    let expectedResult: ICompte | ICompte[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CompteService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
        surname: 'AAAAAAA',
        age: 0,
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

      it('should create a Compte', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Compte()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Compte', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            surname: 'BBBBBB',
            age: 1,
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

      it('should partial update a Compte', () => {
        const patchObject = Object.assign(
          {
            surname: 'BBBBBB',
            age: 1,
            adress: 'BBBBBB',
          },
          new Compte()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Compte', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            surname: 'BBBBBB',
            age: 1,
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

      it('should delete a Compte', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCompteToCollectionIfMissing', () => {
        it('should add a Compte to an empty array', () => {
          const compte: ICompte = { id: 'ABC' };
          expectedResult = service.addCompteToCollectionIfMissing([], compte);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(compte);
        });

        it('should not add a Compte to an array that contains it', () => {
          const compte: ICompte = { id: 'ABC' };
          const compteCollection: ICompte[] = [
            {
              ...compte,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addCompteToCollectionIfMissing(compteCollection, compte);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Compte to an array that doesn't contain it", () => {
          const compte: ICompte = { id: 'ABC' };
          const compteCollection: ICompte[] = [{ id: 'CBA' }];
          expectedResult = service.addCompteToCollectionIfMissing(compteCollection, compte);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(compte);
        });

        it('should add only unique Compte to an array', () => {
          const compteArray: ICompte[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Bhoutan protocol' }];
          const compteCollection: ICompte[] = [{ id: 'ABC' }];
          expectedResult = service.addCompteToCollectionIfMissing(compteCollection, ...compteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const compte: ICompte = { id: 'ABC' };
          const compte2: ICompte = { id: 'CBA' };
          expectedResult = service.addCompteToCollectionIfMissing([], compte, compte2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(compte);
          expect(expectedResult).toContain(compte2);
        });

        it('should accept null and undefined values', () => {
          const compte: ICompte = { id: 'ABC' };
          expectedResult = service.addCompteToCollectionIfMissing([], null, compte, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(compte);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
