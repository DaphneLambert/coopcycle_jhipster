jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PanierService } from '../service/panier.service';
import { IPanier, Panier } from '../panier.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { PanierUpdateComponent } from './panier-update.component';

describe('Component Tests', () => {
  describe('Panier Management Update Component', () => {
    let comp: PanierUpdateComponent;
    let fixture: ComponentFixture<PanierUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let panierService: PanierService;
    let produitService: ProduitService;
    let compteService: CompteService;
    let restaurantService: RestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PanierUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PanierUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PanierUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      panierService = TestBed.inject(PanierService);
      produitService = TestBed.inject(ProduitService);
      compteService = TestBed.inject(CompteService);
      restaurantService = TestBed.inject(RestaurantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Produit query and add missing value', () => {
        const panier: IPanier = { id: 'CBA' };
        const contents: IProduit[] = [{ id: 'compress Cambrid' }];
        panier.contents = contents;

        const produitCollection: IProduit[] = [{ id: 'XSS logistical M' }];
        spyOn(produitService, 'query').and.returnValue(of(new HttpResponse({ body: produitCollection })));
        const additionalProduits = [...contents];
        const expectedCollection: IProduit[] = [...additionalProduits, ...produitCollection];
        spyOn(produitService, 'addProduitToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(produitService.query).toHaveBeenCalled();
        expect(produitService.addProduitToCollectionIfMissing).toHaveBeenCalledWith(produitCollection, ...additionalProduits);
        expect(comp.produitsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Compte query and add missing value', () => {
        const panier: IPanier = { id: 'CBA' };
        const compte: ICompte = { id: 'AI' };
        panier.compte = compte;

        const compteCollection: ICompte[] = [{ id: 'Account Sausages' }];
        spyOn(compteService, 'query').and.returnValue(of(new HttpResponse({ body: compteCollection })));
        const additionalComptes = [compte];
        const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
        spyOn(compteService, 'addCompteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(compteService.query).toHaveBeenCalled();
        expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(compteCollection, ...additionalComptes);
        expect(comp.comptesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Restaurant query and add missing value', () => {
        const panier: IPanier = { id: 'CBA' };
        const restaurant: IRestaurant = { id: 'Saint-Honoré Ref' };
        panier.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 'Sleek Advanced' }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const additionalRestaurants = [restaurant];
        const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, ...additionalRestaurants);
        expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const panier: IPanier = { id: 'CBA' };
        const contents: IProduit = { id: 'online auxiliary' };
        panier.contents = [contents];
        const compte: ICompte = { id: 'Handcrafted' };
        panier.compte = compte;
        const restaurant: IRestaurant = { id: 'Kids e-business' };
        panier.restaurant = restaurant;

        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(panier));
        expect(comp.produitsSharedCollection).toContain(contents);
        expect(comp.comptesSharedCollection).toContain(compte);
        expect(comp.restaurantsSharedCollection).toContain(restaurant);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = { id: 'ABC' };
        spyOn(panierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: panier }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(panierService.update).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = new Panier();
        spyOn(panierService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: panier }));
        saveSubject.complete();

        // THEN
        expect(panierService.create).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const panier = { id: 'ABC' };
        spyOn(panierService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ panier });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(panierService.update).toHaveBeenCalledWith(panier);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProduitById', () => {
        it('Should return tracked Produit primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackProduitById(0, entity);
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
      describe('getSelectedProduit', () => {
        it('Should return option if no Produit is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedProduit(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Produit for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedProduit(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Produit is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedProduit(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
