import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPanier, Panier } from '../panier.model';
import { PanierService } from '../service/panier.service';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-panier-update',
  templateUrl: './panier-update.component.html',
})
export class PanierUpdateComponent implements OnInit {
  isSaving = false;

  produitsSharedCollection: IProduit[] = [];
  comptesSharedCollection: ICompte[] = [];
  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required, Validators.maxLength(16)]],
    nbElements: [null, [Validators.required]],
    price: [null, [Validators.required]],
    contents: [],
    compte: [],
    restaurant: [],
  });

  constructor(
    protected panierService: PanierService,
    protected produitService: ProduitService,
    protected compteService: CompteService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ panier }) => {
      this.updateForm(panier);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const panier = this.createFromForm();
    if (panier.id !== undefined) {
      this.subscribeToSaveResponse(this.panierService.update(panier));
    } else {
      this.subscribeToSaveResponse(this.panierService.create(panier));
    }
  }

  trackProduitById(index: number, item: IProduit): string {
    return item.id!;
  }

  trackCompteById(index: number, item: ICompte): string {
    return item.id!;
  }

  trackRestaurantById(index: number, item: IRestaurant): string {
    return item.id!;
  }

  getSelectedProduit(option: IProduit, selectedVals?: IProduit[]): IProduit {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPanier>>): void {
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

  protected updateForm(panier: IPanier): void {
    this.editForm.patchValue({
      id: panier.id,
      nbElements: panier.nbElements,
      price: panier.price,
      contents: panier.contents,
      compte: panier.compte,
      restaurant: panier.restaurant,
    });

    this.produitsSharedCollection = this.produitService.addProduitToCollectionIfMissing(
      this.produitsSharedCollection,
      ...(panier.contents ?? [])
    );
    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing(this.comptesSharedCollection, panier.compte);
    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      panier.restaurant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.produitService
      .query()
      .pipe(map((res: HttpResponse<IProduit[]>) => res.body ?? []))
      .pipe(
        map((produits: IProduit[]) =>
          this.produitService.addProduitToCollectionIfMissing(produits, ...(this.editForm.get('contents')!.value ?? []))
        )
      )
      .subscribe((produits: IProduit[]) => (this.produitsSharedCollection = produits));

    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(map((comptes: ICompte[]) => this.compteService.addCompteToCollectionIfMissing(comptes, this.editForm.get('compte')!.value)))
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));
  }

  protected createFromForm(): IPanier {
    return {
      ...new Panier(),
      id: this.editForm.get(['id'])!.value,
      nbElements: this.editForm.get(['nbElements'])!.value,
      price: this.editForm.get(['price'])!.value,
      contents: this.editForm.get(['contents'])!.value,
      compte: this.editForm.get(['compte'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
    };
  }
}
