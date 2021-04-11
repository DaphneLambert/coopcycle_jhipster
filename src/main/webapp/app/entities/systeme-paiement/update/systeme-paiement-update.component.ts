import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISystemePaiement, SystemePaiement } from '../systeme-paiement.model';
import { SystemePaiementService } from '../service/systeme-paiement.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';

@Component({
  selector: 'jhi-systeme-paiement-update',
  templateUrl: './systeme-paiement-update.component.html',
})
export class SystemePaiementUpdateComponent implements OnInit {
  isSaving = false;

  comptesSharedCollection: ICompte[] = [];

  editForm = this.fb.group({
    id: [],
    method: [null, [Validators.required]],
    agents: [],
  });

  constructor(
    protected systemePaiementService: SystemePaiementService,
    protected compteService: CompteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ systemePaiement }) => {
      this.updateForm(systemePaiement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const systemePaiement = this.createFromForm();
    if (systemePaiement.id !== undefined) {
      this.subscribeToSaveResponse(this.systemePaiementService.update(systemePaiement));
    } else {
      this.subscribeToSaveResponse(this.systemePaiementService.create(systemePaiement));
    }
  }

  trackCompteById(index: number, item: ICompte): string {
    return item.id!;
  }

  getSelectedCompte(option: ICompte, selectedVals?: ICompte[]): ICompte {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISystemePaiement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(systemePaiement: ISystemePaiement): void {
    this.editForm.patchValue({
      id: systemePaiement.id,
      method: systemePaiement.method,
      agents: systemePaiement.agents,
    });

    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing(
      this.comptesSharedCollection,
      ...(systemePaiement.agents ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(
        map((comptes: ICompte[]) =>
          this.compteService.addCompteToCollectionIfMissing(comptes, ...(this.editForm.get('agents')!.value ?? []))
        )
      )
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));
  }

  protected createFromForm(): ISystemePaiement {
    return {
      ...new SystemePaiement(),
      id: this.editForm.get(['id'])!.value,
      method: this.editForm.get(['method'])!.value,
      agents: this.editForm.get(['agents'])!.value,
    };
  }
}
