import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SystemePaiementService } from '../service/systeme-paiement.service';

import { SystemePaiementComponent } from './systeme-paiement.component';

describe('Component Tests', () => {
  describe('SystemePaiement Management Component', () => {
    let comp: SystemePaiementComponent;
    let fixture: ComponentFixture<SystemePaiementComponent>;
    let service: SystemePaiementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SystemePaiementComponent],
      })
        .overrideTemplate(SystemePaiementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SystemePaiementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SystemePaiementService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.systemePaiements?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
