jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CompteService } from '../service/compte.service';
import { ICompte, Compte } from '../compte.model';
import { IRoles } from 'app/entities/roles/roles.model';
import { RolesService } from 'app/entities/roles/service/roles.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

import { CompteUpdateComponent } from './compte-update.component';

describe('Component Tests', () => {
  describe('Compte Management Update Component', () => {
    let comp: CompteUpdateComponent;
    let fixture: ComponentFixture<CompteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let compteService: CompteService;
    let rolesService: RolesService;
    let cooperativeService: CooperativeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CompteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CompteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CompteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      compteService = TestBed.inject(CompteService);
      rolesService = TestBed.inject(RolesService);
      cooperativeService = TestBed.inject(CooperativeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Roles query and add missing value', () => {
        const compte: ICompte = { id: 'CBA' };
        const roles: IRoles = { id: 18127 };
        compte.roles = roles;

        const rolesCollection: IRoles[] = [{ id: 9219 }];
        spyOn(rolesService, 'query').and.returnValue(of(new HttpResponse({ body: rolesCollection })));
        const additionalRoles = [roles];
        const expectedCollection: IRoles[] = [...additionalRoles, ...rolesCollection];
        spyOn(rolesService, 'addRolesToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        expect(rolesService.query).toHaveBeenCalled();
        expect(rolesService.addRolesToCollectionIfMissing).toHaveBeenCalledWith(rolesCollection, ...additionalRoles);
        expect(comp.rolesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Cooperative query and add missing value', () => {
        const compte: ICompte = { id: 'CBA' };
        const cooperative: ICooperative = { id: 'synergize Czech' };
        compte.cooperative = cooperative;

        const cooperativeCollection: ICooperative[] = [{ id: 'a Naira Salomon' }];
        spyOn(cooperativeService, 'query').and.returnValue(of(new HttpResponse({ body: cooperativeCollection })));
        const additionalCooperatives = [cooperative];
        const expectedCollection: ICooperative[] = [...additionalCooperatives, ...cooperativeCollection];
        spyOn(cooperativeService, 'addCooperativeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        expect(cooperativeService.query).toHaveBeenCalled();
        expect(cooperativeService.addCooperativeToCollectionIfMissing).toHaveBeenCalledWith(
          cooperativeCollection,
          ...additionalCooperatives
        );
        expect(comp.cooperativesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const compte: ICompte = { id: 'CBA' };
        const roles: IRoles = { id: 85197 };
        compte.roles = roles;
        const cooperative: ICooperative = { id: 'c' };
        compte.cooperative = cooperative;

        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(compte));
        expect(comp.rolesSharedCollection).toContain(roles);
        expect(comp.cooperativesSharedCollection).toContain(cooperative);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = { id: 'ABC' };
        spyOn(compteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: compte }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(compteService.update).toHaveBeenCalledWith(compte);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = new Compte();
        spyOn(compteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: compte }));
        saveSubject.complete();

        // THEN
        expect(compteService.create).toHaveBeenCalledWith(compte);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const compte = { id: 'ABC' };
        spyOn(compteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ compte });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(compteService.update).toHaveBeenCalledWith(compte);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRolesById', () => {
        it('Should return tracked Roles primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRolesById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCooperativeById', () => {
        it('Should return tracked Cooperative primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCooperativeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
