jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CourseService } from '../service/course.service';
import { ICourse, Course } from '../course.model';
import { IPanier } from 'app/entities/panier/panier.model';
import { PanierService } from 'app/entities/panier/service/panier.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { CourseUpdateComponent } from './course-update.component';

describe('Component Tests', () => {
  describe('Course Management Update Component', () => {
    let comp: CourseUpdateComponent;
    let fixture: ComponentFixture<CourseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let courseService: CourseService;
    let panierService: PanierService;
    let compteService: CompteService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CourseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CourseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CourseUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      courseService = TestBed.inject(CourseService);
      panierService = TestBed.inject(PanierService);
      compteService = TestBed.inject(CompteService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call order query and add missing value', () => {
        const course: ICourse = { id: 'CBA' };
        const order: IPanier = { id: 'interface Accoun' };
        course.order = order;

        const orderCollection: IPanier[] = [{ id: 'deliver' }];
        spyOn(panierService, 'query').and.returnValue(of(new HttpResponse({ body: orderCollection })));
        const expectedCollection: IPanier[] = [order, ...orderCollection];
        spyOn(panierService, 'addPanierToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ course });
        comp.ngOnInit();

        expect(panierService.query).toHaveBeenCalled();
        expect(panierService.addPanierToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, order);
        expect(comp.ordersCollection).toEqual(expectedCollection);
      });

      it('Should call Compte query and add missing value', () => {
        const course: ICourse = { id: 'CBA' };
        const agents: ICompte[] = [{ id: 'background Enhan' }];
        course.agents = agents;

        const compteCollection: ICompte[] = [{ id: 'b calculating' }];
        spyOn(compteService, 'query').and.returnValue(of(new HttpResponse({ body: compteCollection })));
        const additionalComptes = [...agents];
        const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
        spyOn(compteService, 'addCompteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ course });
        comp.ngOnInit();

        expect(compteService.query).toHaveBeenCalled();
        expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(compteCollection, ...additionalComptes);
        expect(comp.comptesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Restaurant query and add missing value', () => {
        const course: ICourse = { id: 'CBA' };
        const restaurant: IRestaurant = { id: 'Account' };
        course.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 'cross-platform B' }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ course });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const course: ICourse = { id: 'CBA' };
        const order: IPanier = { id: 'AGP' };
        course.order = order;
        const agents: ICompte = { id: 'Ergonomic Soft' };
        course.agents = [agents];
        const restaurant: IRestaurant = { id: "d'Abbeville" };
        course.restaurant = restaurant;

        activatedRoute.data = of({ course });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(course));
        expect(comp.ordersCollection).toContain(order);
        expect(comp.comptesSharedCollection).toContain(agents);
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const course = { id: 'ABC' };
        spyOn(courseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ course });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: course }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(courseService.update).toHaveBeenCalledWith(course);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const course = new Course();
        spyOn(courseService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ course });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: course }));
        saveSubject.complete();

        // THEN
        expect(courseService.create).toHaveBeenCalledWith(course);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const course = { id: 'ABC' };
        spyOn(courseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ course });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(courseService.update).toHaveBeenCalledWith(course);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPanierById', () => {
        it('Should return tracked Panier primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackPanierById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCompteById', () => {
        it('Should return tracked Compte primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCompteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCompte', () => {
        it('Should return option if no Compte is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedCompte(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Compte for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedCompte(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Compte is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedCompte(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
