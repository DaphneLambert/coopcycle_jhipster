import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CompteService } from '../service/compte.service';

import { CompteComponent } from './compte.component';

describe('Component Tests', () => {
  describe('Compte Management Component', () => {
    let comp: CompteComponent;
    let fixture: ComponentFixture<CompteComponent>;
    let service: CompteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CompteComponent],
      })
        .overrideTemplate(CompteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CompteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CompteService);

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
      expect(comp.comptes?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
