jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PanierService } from '../service/panier.service';

import { PanierDeleteDialogComponent } from './panier-delete-dialog.component';

describe('Component Tests', () => {
  describe('Panier Management Delete Component', () => {
    let comp: PanierDeleteDialogComponent;
    let fixture: ComponentFixture<PanierDeleteDialogComponent>;
    let service: PanierService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PanierDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(PanierDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PanierDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PanierService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
