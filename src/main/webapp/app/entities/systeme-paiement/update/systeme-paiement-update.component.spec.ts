jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SystemePaiementService } from '../service/systeme-paiement.service';
import { ISystemePaiement, SystemePaiement } from '../systeme-paiement.model';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';

import { SystemePaiementUpdateComponent } from './systeme-paiement-update.component';

describe('Component Tests', () => {
  describe('SystemePaiement Management Update Component', () => {
    let comp: SystemePaiementUpdateComponent;
    let fixture: ComponentFixture<SystemePaiementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let systemePaiementService: SystemePaiementService;
    let compteService: CompteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SystemePaiementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SystemePaiementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SystemePaiementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      systemePaiementService = TestBed.inject(SystemePaiementService);
      compteService = TestBed.inject(CompteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Compte query and add missing value', () => {
        const systemePaiement: ISystemePaiement = { id: 456 };
        const agents: ICompte[] = [{ id: 'c' }];
        systemePaiement.agents = agents;

        const compteCollection: ICompte[] = [{ id: 'Provence' }];
        spyOn(compteService, 'query').and.returnValue(of(new HttpResponse({ body: compteCollection })));
        const additionalComptes = [...agents];
        const expectedCollection: ICompte[] = [...additionalComptes, ...compteCollection];
        spyOn(compteService, 'addCompteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ systemePaiement });
        comp.ngOnInit();

        expect(compteService.query).toHaveBeenCalled();
        expect(compteService.addCompteToCollectionIfMissing).toHaveBeenCalledWith(compteCollection, ...additionalComptes);
        expect(comp.comptesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const systemePaiement: ISystemePaiement = { id: 456 };
        const agents: ICompte = { id: 'EXE' };
        systemePaiement.agents = [agents];

        activatedRoute.data = of({ systemePaiement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(systemePaiement));
        expect(comp.comptesSharedCollection).toContain(agents);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const systemePaiement = { id: 123 };
        spyOn(systemePaiementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ systemePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: systemePaiement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(systemePaiementService.update).toHaveBeenCalledWith(systemePaiement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const systemePaiement = new SystemePaiement();
        spyOn(systemePaiementService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ systemePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: systemePaiement }));
        saveSubject.complete();

        // THEN
        expect(systemePaiementService.create).toHaveBeenCalledWith(systemePaiement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const systemePaiement = { id: 123 };
        spyOn(systemePaiementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ systemePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(systemePaiementService.update).toHaveBeenCalledWith(systemePaiement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCompteById', () => {
        it('Should return tracked Compte primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCompteById(0, entity);
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
