import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPanier } from '../panier.model';
import { PanierService } from '../service/panier.service';

@Component({
  templateUrl: './panier-delete-dialog.component.html',
})
export class PanierDeleteDialogComponent {
  panier?: IPanier;

  constructor(protected panierService: PanierService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.panierService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
