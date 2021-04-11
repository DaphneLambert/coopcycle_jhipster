import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PanierService } from '../service/panier.service';

import { PanierComponent } from './panier.component';

describe('Component Tests', () => {
  describe('Panier Management Component', () => {
    let comp: PanierComponent;
    let fixture: ComponentFixture<PanierComponent>;
    let service: PanierService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PanierComponent],
      })
        .overrideTemplate(PanierComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PanierComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PanierService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
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
      expect(comp.paniers?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
