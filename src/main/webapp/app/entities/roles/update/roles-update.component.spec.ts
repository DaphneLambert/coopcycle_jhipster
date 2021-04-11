jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RolesService } from '../service/roles.service';
import { IRoles, Roles } from '../roles.model';

import { RolesUpdateComponent } from './roles-update.component';

describe('Component Tests', () => {
  describe('Roles Management Update Component', () => {
    let comp: RolesUpdateComponent;
    let fixture: ComponentFixture<RolesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rolesService: RolesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RolesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RolesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RolesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rolesService = TestBed.inject(RolesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const roles: IRoles = { id: 456 };

        activatedRoute.data = of({ roles });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(roles));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roles = { id: 123 };
        spyOn(rolesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: roles }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rolesService.update).toHaveBeenCalledWith(roles);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roles = new Roles();
        spyOn(rolesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: roles }));
        saveSubject.complete();

        // THEN
        expect(rolesService.create).toHaveBeenCalledWith(roles);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const roles = { id: 123 };
        spyOn(rolesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ roles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rolesService.update).toHaveBeenCalledWith(roles);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
