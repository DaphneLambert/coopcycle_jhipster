import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISystemePaiement } from '../systeme-paiement.model';
import { SystemePaiementService } from '../service/systeme-paiement.service';
import { SystemePaiementDeleteDialogComponent } from '../delete/systeme-paiement-delete-dialog.component';

@Component({
  selector: 'jhi-systeme-paiement',
  templateUrl: './systeme-paiement.component.html',
})
export class SystemePaiementComponent implements OnInit {
  systemePaiements?: ISystemePaiement[];
  isLoading = false;

  constructor(protected systemePaiementService: SystemePaiementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.systemePaiementService.query().subscribe(
      (res: HttpResponse<ISystemePaiement[]>) => {
        this.isLoading = false;
        this.systemePaiements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISystemePaiement): number {
    return item.id!;
  }

  delete(systemePaiement: ISystemePaiement): void {
    const modalRef = this.modalService.open(SystemePaiementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.systemePaiement = systemePaiement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
