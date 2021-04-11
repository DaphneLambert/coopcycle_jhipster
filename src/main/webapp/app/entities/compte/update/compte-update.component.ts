import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICompte, Compte } from '../compte.model';
import { CompteService } from '../service/compte.service';
import { IRoles } from 'app/entities/roles/roles.model';
import { RolesService } from 'app/entities/roles/service/roles.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

@Component({
  selector: 'jhi-compte-update',
  templateUrl: './compte-update.component.html',
})
export class CompteUpdateComponent implements OnInit {
  isSaving = false;

  rolesSharedCollection: IRoles[] = [];
  cooperativesSharedCollection: ICooperative[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required, Validators.maxLength(16)]],
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    age: [null, [Validators.min(0), Validators.max(120)]],
    adress: [null, [Validators.required]],
    roles: [],
    cooperative: [],
  });

  constructor(
    protected compteService: CompteService,
    protected rolesService: RolesService,
    protected cooperativeService: CooperativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compte }) => {
      this.updateForm(compte);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compte = this.createFromForm();
    if (compte.id !== undefined) {
      this.subscribeToSaveResponse(this.compteService.update(compte));
    } else {
      this.subscribeToSaveResponse(this.compteService.create(compte));
    }
  }

  trackRolesById(index: number, item: IRoles): number {
    return item.id!;
  }

  trackCooperativeById(index: number, item: ICooperative): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompte>>): void {
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

  protected updateForm(compte: ICompte): void {
    this.editForm.patchValue({
      id: compte.id,
      name: compte.name,
      surname: compte.surname,
      age: compte.age,
      adress: compte.adress,
      roles: compte.roles,
      cooperative: compte.cooperative,
    });

    this.rolesSharedCollection = this.rolesService.addRolesToCollectionIfMissing(this.rolesSharedCollection, compte.roles);
    this.cooperativesSharedCollection = this.cooperativeService.addCooperativeToCollectionIfMissing(
      this.cooperativesSharedCollection,
      compte.cooperative
    );
  }

  protected loadRelationshipsOptions(): void {
    this.rolesService
      .query()
      .pipe(map((res: HttpResponse<IRoles[]>) => res.body ?? []))
      .pipe(map((roles: IRoles[]) => this.rolesService.addRolesToCollectionIfMissing(roles, this.editForm.get('roles')!.value)))
      .subscribe((roles: IRoles[]) => (this.rolesSharedCollection = roles));

    this.cooperativeService
      .query()
      .pipe(map((res: HttpResponse<ICooperative[]>) => res.body ?? []))
      .pipe(
        map((cooperatives: ICooperative[]) =>
          this.cooperativeService.addCooperativeToCollectionIfMissing(cooperatives, this.editForm.get('cooperative')!.value)
        )
      )
      .subscribe((cooperatives: ICooperative[]) => (this.cooperativesSharedCollection = cooperatives));
  }

  protected createFromForm(): ICompte {
    return {
      ...new Compte(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      surname: this.editForm.get(['surname'])!.value,
      age: this.editForm.get(['age'])!.value,
      adress: this.editForm.get(['adress'])!.value,
      roles: this.editForm.get(['roles'])!.value,
      cooperative: this.editForm.get(['cooperative'])!.value,
    };
  }
}
