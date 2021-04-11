jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProduitService } from '../service/produit.service';
import { IProduit, Produit } from '../produit.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { ProduitUpdateComponent } from './produit-update.component';

describe('Component Tests', () => {
  describe('Produit Management Update Component', () => {
    let comp: ProduitUpdateComponent;
    let fixture: ComponentFixture<ProduitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let produitService: ProduitService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProduitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProduitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProduitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      produitService = TestBed.inject(ProduitService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Restaurant query and add missing value', () => {
        const produit: IProduit = { id: 'CBA' };
        const restaurant: IRestaurant = { id: 'Australie de rec' };
        produit.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 'Bedfordshire plu' }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const produit: IProduit = { id: 'CBA' };
        const restaurant: IRestaurant = { id: 'bluetooth (E.M.U' };
        produit.restaurant = restaurant;

        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(produit));
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = { id: 'ABC' };
        spyOn(produitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(produitService.update).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = new Produit();
        spyOn(produitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: produit }));
        saveSubject.complete();

        // THEN
        expect(produitService.create).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const produit = { id: 'ABC' };
        spyOn(produitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ produit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(produitService.update).toHaveBeenCalledWith(produit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
