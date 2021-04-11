import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPanier } from '../panier.model';
import { PanierService } from '../service/panier.service';
import { PanierDeleteDialogComponent } from '../delete/panier-delete-dialog.component';

@Component({
  selector: 'jhi-panier',
  templateUrl: './panier.component.html',
})
export class PanierComponent implements OnInit {
  paniers?: IPanier[];
  isLoading = false;

  constructor(protected panierService: PanierService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.panierService.query().subscribe(
      (res: HttpResponse<IPanier[]>) => {
        this.isLoading = false;
        this.paniers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPanier): string {
    return item.id!;
  }

  delete(panier: IPanier): void {
    const modalRef = this.modalService.open(PanierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.panier = panier;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
