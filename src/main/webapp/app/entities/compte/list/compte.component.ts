import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompte } from '../compte.model';
import { CompteService } from '../service/compte.service';
import { CompteDeleteDialogComponent } from '../delete/compte-delete-dialog.component';

@Component({
  selector: 'jhi-compte',
  templateUrl: './compte.component.html',
})
export class CompteComponent implements OnInit {
  comptes?: ICompte[];
  isLoading = false;

  constructor(protected compteService: CompteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.compteService.query().subscribe(
      (res: HttpResponse<ICompte[]>) => {
        this.isLoading = false;
        this.comptes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICompte): string {
    return item.id!;
  }

  delete(compte: ICompte): void {
    const modalRef = this.modalService.open(CompteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.compte = compte;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
