import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICourse, Course } from '../course.model';

import { CourseService } from './course.service';

describe('Service Tests', () => {
  describe('Course Service', () => {
    let service: CourseService;
    let httpMock: HttpTestingController;
    let elemDefault: ICourse;
    let expectedResult: ICourse | ICourse[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CourseService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        timeRequired: 0,
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

      it('should create a Course', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Course()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Course', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            timeRequired: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Course', () => {
        const patchObject = Object.assign(
          {
            timeRequired: 1,
          },
          new Course()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Course', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            timeRequired: 1,
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

      it('should delete a Course', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCourseToCollectionIfMissing', () => {
        it('should add a Course to an empty array', () => {
          const course: ICourse = { id: 'ABC' };
          expectedResult = service.addCourseToCollectionIfMissing([], course);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(course);
        });

        it('should not add a Course to an array that contains it', () => {
          const course: ICourse = { id: 'ABC' };
          const courseCollection: ICourse[] = [
            {
              ...course,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Course to an array that doesn't contain it", () => {
          const course: ICourse = { id: 'ABC' };
          const courseCollection: ICourse[] = [{ id: 'CBA' }];
          expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(course);
        });

        it('should add only unique Course to an array', () => {
          const courseArray: ICourse[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'neural Euro seiz' }];
          const courseCollection: ICourse[] = [{ id: 'ABC' }];
          expectedResult = service.addCourseToCollectionIfMissing(courseCollection, ...courseArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const course: ICourse = { id: 'ABC' };
          const course2: ICourse = { id: 'CBA' };
          expectedResult = service.addCourseToCollectionIfMissing([], course, course2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(course);
          expect(expectedResult).toContain(course2);
        });

        it('should accept null and undefined values', () => {
          const course: ICourse = { id: 'ABC' };
          expectedResult = service.addCourseToCollectionIfMissing([], null, course, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(course);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
